import { faker } from '@faker-js/faker';
import type { Browser, Page } from '@playwright/test';

import { test, expect } from './utils/test';
import { OmnichannelLiveChat, HomeChannel } from './page-objects';

const createAuxContext = async (browser: Browser, storageState: string): Promise<{ page: Page; poHomeChannel: HomeChannel }> => {
	const page = await browser.newPage({ storageState });
	const poHomeChannel = new HomeChannel(page);
	await page.goto('/');
	await page.locator('.main-content').waitFor();

	return { page, poHomeChannel };
};

test.describe('Omnichannel close chat', () => {
	let poLiveChat: OmnichannelLiveChat;
	let newUser: { email: string; name: string };

	let agent: { page: Page; poHomeChannel: HomeChannel };

	test.beforeAll(async ({ api, browser }) => {
		newUser = {
			name: faker.name.firstName(),
			email: faker.internet.email(),
		};

		// Set user user 1 as manager and agent
		await api.post('/livechat/users/agent', { username: 'user1' });
		await api.post('/livechat/users/manager', { username: 'user1' });
		agent = await createAuxContext(browser, 'user1-session.json');
	});
	test.beforeEach(async ({ page }) => {
		poLiveChat = new OmnichannelLiveChat(page);
	});

	test.afterAll(async ({ api }) => {
		await api.delete('/livechat/users/agent/user1');
		await api.delete('/livechat/users/manager/user1');
	});

	test('Receiving a message from visitor', async ({ page }) => {
		await test.step('Expect send a message as a visitor', async () => {
			await page.goto('/livechat');
			await poLiveChat.btnOpenLiveChat('R').click();
			await poLiveChat.openChat(newUser, false);
			await poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
			await poLiveChat.btnSendMessageToOnlineAgent.click();
		});

		await test.step('Expect to have 1 omnichannel assigned to agent 1', async () => {
			await agent.poHomeChannel.sidenav.openChat(newUser.name);
		});

		await test.step('Expect to be able to close an omnichannel to conversation', async () => {
			await agent.poHomeChannel.content.btnCloseChat.click();
			await agent.poHomeChannel.content.inputModalClosingComment.type('any_comment');
			await agent.poHomeChannel.content.btnModalConfirm.click();
			await expect(agent.poHomeChannel.toastSuccess).toBeVisible();
		});
	});
});

<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Select from "$lib/components/ui/select/index.js";

	import TalkEditor from "./lib/TalkEditor.svelte";

	import {
		LogToText,
		craeteTextModel,
		type LogCollection,
		type LogItem,
		type Talk,
		type Template,
		type TextModel,
		type a,
	} from "./log";

	const keys = {
		logData: "a12logs",
	};

	// let log: LogCollection = {
	// 	items: [{
	// 		id: crypto.randomUUID(),
	// 		title: "test",
	// 		talkItems: [

	// 			{
	// 				head: "SD",
	// 				body: "test\nadaw\nadwada\nsdawdwa\n",
	// 				id: crypto.randomUUID(),
	// 			},

	// 			{
	// 				head: "CS",
	// 				body: "あいえうお\nかきくけこ",
	// 				id: crypto.randomUUID(),

	// 			},

	// 			{
	// 				head: "SD",
	// 				body: "あいえうお\nかきくけこ",
	// 				id: crypto.randomUUID(),

	// 			},

	// 			{
	// 				head: "CS",
	// 				body: "テスト",
	// 				id: crypto.randomUUID(),
	// 			},
	// 		]
	// 	},
	// 	{
	// 		title: "test2",
	// 		id: crypto.randomUUID(),

	// 		talkItems: [{
	// 			head: "HL",
	// 			body: "test",
	// 			id: crypto.randomUUID(),
	// 		}]
	// 	}]
	// };

	//設定
	//@ts-ignore　エラー回避
	const settings = global_settings;
	const templates: Template[] = settings.templates;

	const localData = localStorage.getItem(keys.logData);
	const log: LogCollection = localData
		? JSON.parse(localData)
		: { items: [] };

	let textModelMap = new Map<string, TextModel>();
	log.items.forEach((l) =>
		l.talkItems.forEach((item) =>
			textModelMap.set(item.id, craeteTextModel(item.id, item.body)),
		),
	);

	//選択したログを保持する
	let selectedLogItem: LogItem | undefined;

	//
	$: items = log.items.map((item) => ({ value: item.id, label: item.title }));
	$: selectedItem = {
		value: selectedLogItem?.id,
		label: selectedLogItem?.title,
	};

	//ログを選択したときのイベント
	const handleSelectLogItem = (selectedItem: any) => {
		const item = log.items.find((item) => item.id == selectedItem.value);
		selectedLogItem = item;
	};

	//新規トークが作成されたときのイベント
	const handleCreateTalkItem = (talkItem: Talk) => {
		//作成されたトークオブジェクトのIDからテキストモデルを取得する
		const textModel = textModelMap.get(talkItem.id);

		//もし存在しなければ当該IDでテキストモデルを作成する
		if (!textModel) {
			textModelMap.set(talkItem.id, craeteTextModel(talkItem.id, ""));
		}
	};

	const handleChangeTalkItem = (talkItem: Talk) => {
		saveToLocal();
	};

	//新規作成のクリックイベント
	const handleCreateNewHistory = () => {
		const firstTalk: Talk = {
			id: crypto.randomUUID(),
			head: settings.turn1,
			body: "",
		};

		textModelMap.set(
			firstTalk.id,
			craeteTextModel(firstTalk.id, firstTalk.body),
		);

		const newLogItem: LogItem = {
			id: crypto.randomUUID(),
			title: "新規履歴",
			talkItems: [firstTalk],
		};

		log.items.push(newLogItem);
		selectedLogItem = newLogItem;

		saveToLocal();
	};

	const handleCopyToText = () => {
		if (selectedLogItem) navigator.clipboard.writeText(LogToText(selectedLogItem));
	};

	const saveToLocal = () => {
		//ローカルに保存する
		localStorage.setItem(keys.logData, JSON.stringify(log));
	};

	const resetFromLocal = () => {
		selectedLogItem = undefined;
		log.items = [];
		localStorage.removeItem(keys.logData);
	}

	const insertTemplate = (template: Template) => {

		if (!selectedLogItem) return;

		const insertTalks: Talk[] = template.body.map(item => {
		
			const newTalk: Talk = {	
				id: crypto.randomUUID(),
				head: item.turn,
				body: item.text,
			}

			textModelMap.set(newTalk.id, craeteTextModel(newTalk.id, newTalk.body));

			return newTalk;
		});

		selectedLogItem.talkItems = insertTalks;

		// selectedLogItem?.talkItems.push(...insertTalks);
	}

</script>

<main class="text-foreground bg-background antialiased">
	<div class="mainContainer">
		<div class="px-3 py-3 flex gap-2">
			<Select.Root
				{items}
				selected={selectedItem}
				onSelectedChange={handleSelectLogItem}
				portal={null}>

				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="履歴" />
				</Select.Trigger>
				<Select.Content>
					{#each log.items as logItem}
						<Select.Item value={logItem.id} label={logItem.title}>{logItem.title}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Button on:click={handleCreateNewHistory} variant="default">新規作成</Button>
			<Button on:click={handleCopyToText} variant="default">テキストとしてコピー</Button>

			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="default">テンプレート</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>挿入するテンプレートを選択してください</Dialog.Title>
						<Dialog.Description>
							
							{#each templates as template}
								<div class="flex gap-2 w-full">
									<div>{template.label}</div>
									<Dialog.Close>
										<Button on:click={() => insertTemplate(template)}>挿入</Button>	
									</Dialog.Close>								
								</div>
							{/each}

						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>

			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="default">履歴をすべて削除</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>確認</Dialog.Title>
						<Dialog.Description>
							本当に履歴をすべて削除しますか？
						</Dialog.Description>
						<Dialog.Close>
							<Button variant="default" on:click={resetFromLocal}>すべて削除する</Button>
						</Dialog.Close>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>

		</div>

		<TalkEditor
			targetLogItem={selectedLogItem}
			onChangeTalkItem={handleChangeTalkItem}
			onCreateTalkItem={handleCreateTalkItem}
			{...{ textModelMap }}
		></TalkEditor>

	</div>
</main>

<style>
	.mainContainer {
		width: 100vw;
		height: 100vh;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
	}
</style>

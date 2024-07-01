<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select/index.js";
    import SettingDialog from "$lib/dialog/SettingDialog.svelte";

	import TalkEditor from "./lib/TalkEditor.svelte";

	import {
		LogToText,
		craeteTextModel,
		getLastTalk,
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

	const handleChangeLogData = (e: LogItem) => {
		console.log(e);
		saveToLocal();
	}

	// //新規作成のクリックイベント
	// const handleCreateNewHistory = () => {
	// 	const firstTalk: Talk = {
	// 		id: crypto.randomUUID(),
	// 		head: settings.turn1,
	// 		body: "",
	// 	};

	// 	textModelMap.set(
	// 		firstTalk.id,
	// 		craeteTextModel(firstTalk.id, firstTalk.body),
	// 	);

	// 	const dt = new Date();

	// 	const newLogItem: LogItem = {
	// 		id: crypto.randomUUID(),
	// 		title: `新規履歴-${dt.getMonth()}/${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}`,
	// 		talkItems: [firstTalk],
	// 	};

	// 	log.items.push(newLogItem);
	// 	selectedLogItem = newLogItem;

	// 	saveToLocal();
	// };

	const handleCopyToText = () => {

		if (selectedLogItem) {

			const text = LogToText(selectedLogItem);

			const init = new Date("1970/1/1 0:0:0");
			const t1 = new Date("1970/1/1 " + selectedLogItem.openTimeText);
			const t2 = new Date("1970/1/1 " + selectedLogItem.acdTimeText);
			
			const calcTime = new Date(t1.getTime() + (t2.getTime() - init.getTime()));

			const head = selectedLogItem.talkItems[0].head == settings.turn1 ? "入電" : "架電";

			const startTime = `${head}:${("0" + t1.getHours()).slice(-2)}:${("0" + t1.getMinutes()).slice(-2)}`;
			const endTime = `切電:${("0" + calcTime.getHours()).slice(-2)}:${("0" + calcTime.getMinutes()).slice(-2)}`;

			const resultText = [startTime, endTime, "", LogToText(selectedLogItem)].join("\n")

			navigator.clipboard.writeText(resultText);

		}
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

		if (selectedLogItem) {
			
			const last = getLastTalk(selectedLogItem);

			if (last && insertTalks.length > 0) {
				if (last.head == insertTalks[0].head) {
					last.body = `${last.body}${last.body.length > 0 ? "\n" : ""}${insertTalks[0].body}`;
					insertTalks.shift();
				}
			}
		}

		selectedLogItem.talkItems = [...selectedLogItem.talkItems, ...insertTalks];
	}

	let showPreviewState = false;
	let previewAreaElement: HTMLTextAreaElement;
	let previewText = "";

	const handleOpenChangePreview = (state: boolean) => {
		showPreviewState = state;
		if (!selectedLogItem) return;
		previewText = LogToText(selectedLogItem);
	}

	let newHistoryTitle = "";
	let isShowTitleInputDialog = false;

	const handleCreateNewHistory2 = () => {
		const dt = new Date();
		newHistoryTitle = `新規履歴-${dt.getMonth()+1}/${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}`;
		isShowTitleInputDialog = true;
	}

	const handleCreateNewHistoryOK = () => {

		const firstTalk: Talk = {
			id: crypto.randomUUID(),
			head: settings.turn1,
			body: "",
		};

		textModelMap.set(
			firstTalk.id,
			craeteTextModel(firstTalk.id, firstTalk.body),
		);

		const dt = new Date();

		const newLogItem: LogItem = {
			id: crypto.randomUUID(),
			title: newHistoryTitle,
			talkItems: [firstTalk],
			openTimeText: "",
			acdTimeText: "",
		};

		log.items.push(newLogItem);
		selectedLogItem = newLogItem;

		saveToLocal();

		isShowTitleInputDialog = false;
	}

	const handleCreateNewHistoryCancel = () => {
		isShowTitleInputDialog = false;
	}


</script>

<main class="text-foreground bg-background antialiased">
	<div class="mainContainer">
		<div class="px-3 py-3 flex gap-2 justify-between">
			<Select.Root
				{items}
				selected={selectedItem}
				onSelectedChange={handleSelectLogItem}
				portal={null}>

				<Select.Trigger class="">
					<Select.Value placeholder="履歴" />
				</Select.Trigger>
				<Select.Content>
					{#each log.items as logItem}
						<Select.Item value={logItem.id} label={logItem.title}>{logItem.title}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<!-- <Button on:click={handleCreateNewHistory} variant="default">新規作成</Button> -->

			<Dialog.Root open={isShowTitleInputDialog}>
				<Dialog.Trigger>
					<Button variant="default" on:click={handleCreateNewHistory2}>新規作成</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>履歴を新規作成</Dialog.Title>

						<Dialog.Description>
							<div class="flex flex-col gap-4 pt-4 pb-4">
								タイトルを入力してください。
								<Input bind:value={newHistoryTitle} />
							</div>
						</Dialog.Description>

						<div class="flex justify-end gap-2">
							<Button on:click={handleCreateNewHistoryOK} variant="default">作成</Button>
							<Button on:click={handleCreateNewHistoryCancel} variant="default">キャンセル</Button>
						</div>

					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>

			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="default">テンプレート</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>挿入するテンプレートを選択してください</Dialog.Title>
						<Dialog.Description>
							
							<div class="flex flex-col gap-2">
								{#each templates as template}
								<div class="flex gap-2 w-full items-center justify-between">
									<div>{template.label}</div>
									<Dialog.Close>
										<Button size="sm" on:click={() => insertTemplate(template)}>追加</Button>	
									</Dialog.Close>
								</div>
							{/each}
							</div>

						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>

			<Button on:click={handleCopyToText} variant="default">テキストとしてコピー</Button>

			<Dialog.Root onOpenChange={handleOpenChangePreview}>
				<Dialog.Trigger>
					<Button variant="default">プレビュー</Button>
				</Dialog.Trigger>
				<Dialog.Content class="max-w-fit">
					<Dialog.Header>
						<Dialog.Title>プレビュー</Dialog.Title>
						<Dialog.Description>
							<div class="overflow-auto p-4 h-[400px] w-[800px] whitespace-pre">{previewText}</div>
								<!-- <textarea 
									bind:this={previewAreaElement} 
									
									class="overflow-auto p-2 h-[400px] w-[100%]" 
									/> -->
						</Dialog.Description>
						<Dialog.Close>
							<Button variant="default">閉じる</Button>
						</Dialog.Close>
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


			<SettingDialog></SettingDialog>

		</div>


		{#if selectedLogItem} 
			<TalkEditor
				targetLogItem={selectedLogItem}
				onChangeLogItem={handleChangeLogData}
				onChangeTalkItem={handleChangeTalkItem}
				onCreateTalkItem={handleCreateTalkItem}
				{...{ textModelMap }}
			></TalkEditor>
		{/if}
		
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

<script lang="ts">
    import { Button } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select/index.js";

	// import "./app.css";
	import TalkEditor from "./lib/TalkEditor.svelte";
	import { craeteTextModel, type LogCollection, type LogItem, type Talk, type TextModel, type a } from "./log";
	
	const logData: LogCollection = {
		logItems: [{
			id: crypto.randomUUID(),
			title: "test",
			talkItems: [

				{
					head: "SD",
					body: "test\nadaw\nadwada\nsdawdwa\n",
					id: crypto.randomUUID(),
				},

				{
					head: "CS",
					body: "あいえうお\nかきくけこ",
					id: crypto.randomUUID(),

				},

				{
					head: "SD",
					body: "あいえうお\nかきくけこ",
					id: crypto.randomUUID(),

				},

				{
					head: "CS",
					body: "テスト",
					id: crypto.randomUUID(),
				},
			]
		}, 
		{
			title: "test2",
			id: crypto.randomUUID(),

			talkItems: [{
				head: "HL",
				body: "test",
				id: crypto.randomUUID(),
			}]
		}]
	};


	let textModelMap = new Map<string, TextModel>();
	logData.logItems.forEach(l => l.talkItems.forEach(item => textModelMap.set(item.id, craeteTextModel(item.id, item.body))));
	// let models = logData.logItems.map(l => l.talkItems.map(item => [item.id, craeteTextModel(item.id, item.body)])).flat();

	let selectedLogItem: LogItem | undefined;

	const handleSelectLogItem = (selectedItem: any) => {
		const item = logData.logItems.find(item => item.id == selectedItem.value);
		selectedLogItem = item;
	};

	const handleCreateTalkItem = (talkItem: Talk) => {

		console.log(talkItem);

		const textModel = textModelMap.get(talkItem.id);
		
		if (!textModel) {
			textModelMap.set(talkItem.id, craeteTextModel(talkItem.id, ""));
		}
	}

	const handleChangeTalkItem = (talkItem: Talk) => {

		

		// console.log(selectedLogItem, logData);
	} 

</script>

<main class="text-foreground bg-background antialiased">

	<div class="mainContainer">
		<div class="px-3 py-3">

			<Select.Root onSelectedChange={handleSelectLogItem} portal={null}>
				<Select.Trigger class="w-[180px]">
				  <Select.Value placeholder="履歴" />
				</Select.Trigger>
				<Select.Content>
				{#each logData.logItems as logItem}
					<Select.Item value={logItem.id} label={logItem.title}>{logItem.title}</Select.Item>
				{/each}
				</Select.Content>
			  </Select.Root>
		</div>

		<TalkEditor 
		targetLogItem={selectedLogItem} 
		onChangeTalkItem={handleChangeTalkItem} 
		onCreateTalkItem={handleCreateTalkItem} {...{textModelMap}}></TalkEditor>

	</div>

</main>


<style>

	.mainContainer {
		width: 100vw;
		height:100vh;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
	}


</style>
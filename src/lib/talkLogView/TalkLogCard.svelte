<script lang="ts">
    import type { Talk } from "src/log";

    export let target: Talk;
    export let selected: boolean = false;

    export let onSelectedTalk: (talk: Talk, element: HTMLDivElement) => void;

    let b = undefined;

    $: selectedClass = selected ? "bg-blue-200" : "";

    const handleClickCard = (e: any) => {
        b = e.target;
        onSelectedTalk?.call(undefined, target, b);
    }

</script>

<div class="card flex border rounded-md hover:bg-blue-100 {selectedClass}" on:click={handleClickCard}>
    <div class="header">{target.head}</div>
    <div class="body">{target.body}</div>
</div>

<style>

    .header {
        font-weight: bold;
        border-radius: 2px;
    }

    .body {
        white-space: pre;
    }

    .card {
        padding: 12px;
        gap: 16px;
        cursor: pointer;
    }

</style>
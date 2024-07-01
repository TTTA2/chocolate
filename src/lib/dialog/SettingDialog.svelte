<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Tabs from "$lib/components/ui/tabs";





</script>

<Dialog.Root>
    <Dialog.Trigger>
        <Button variant="secondary">設定</Button>
    </Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>設定</Dialog.Title>

            <Dialog.Description>
                <Tabs.Root value="1" class="w-full">
                    
                    <Tabs.List class="grid w-full grid-cols-2">
                      <Tabs.Trigger value="1">テンプレート</Tabs.Trigger>
                      <Tabs.Trigger value="2">入力補完</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="1">

                    </Tabs.Content>
                    
                    <Tabs.Content value="2">
                      
                    </Tabs.Content>

                  </Tabs.Root>
            </Dialog.Description>

            <div class="flex justify-end gap-2">
                <Button size="sm" variant="default">設定をダウンロード</Button>
                <Button size="sm" variant="default">閉じる</Button>
            </div>

        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>
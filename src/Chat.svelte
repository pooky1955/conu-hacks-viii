<script>
	import { roomStore, settingsStore, socketStore } from "./store.js"
	import Dialog from "./Dialog.svelte"
	import TextField from "./TextField.svelte"
	let messages = [], messageInput

	$socketStore.on("roomChat", (message) => {
        if (messages[messages.length - 1] && messages[messages.length - 1].user.userId == message.user.userId) {
            messages[messages.length - 1].text += "\n" + message.text
        } else {
            messages.push(message)
        }
		messages = messages
        if (!$settingsStore.chatEnabled) $settingsStore.chatNotifications = true
	})

    $: {
        if ($settingsStore.chatEnabled) $settingsStore.chatNotifications = false
    }

    const sendMessage = () => {
        if (!messageInput || messageInput.length < 1) return
        $socketStore.emit("sendRoomChat", {
            text: messageInput,
            roomId: $roomStore.id,
        })
        messageInput = ""
    }
</script>

<Dialog bind:active={$settingsStore.chatEnabled} closeBtn={true}>
	<div class="chat">
		<div class="messages-container">
            <div class="messages-scroll">
                <div class="messages">
                    {#each messages as message}
                        <div class="message" class:self={message.user.userId == $socketStore.userId} key={message.id}>
                            <div class="top">
                                <span class="username">{message.user.username}</span>
                                <span class="timestamp">{new Date(message.timestamp).toLocaleTimeString('en-US')}</span>
                            </div>
                            <span class="text">{message.text}</span>
                        </div>
                    {/each}
                </div>
            </div>
		</div>
        <div class="input">
            <TextField placeholder="Send message" autofocus={true} enterkeyhint="send" bind:value={messageInput} on:submit={sendMessage}/>
            <button on:click={sendMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
	</div>
</Dialog>

<style>
	.chat {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
		height: 80vh;
        width: 100%;
        gap: 1em;
	}

    .messages-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 100%;
        min-height: 0;
    }

    .messages-scroll {
        overflow-y: scroll;
        overscroll-behavior-y: contain;
        scroll-snap-type: y proximity;
    }

    .messages {
        display: flex;
        flex-direction: column;
        align-items: center;
        scroll-snap-align: end;
    }

    .message {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 0.5em;
        padding: 0.5em;
        border-radius: 0.5em;
        gap: 0.3em;
        background-color: #2a2a2a;
        width: 80%;
        box-shadow: 0 0 0.5em 0 rgba(0, 0, 0, 0.1);
    }

    .message.self {
        background-color: #cce8ff;
    } 

    .message .top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .message .top .username {
        font-weight: bold;
        font-size: 1.1em;
        margin-right: 0.5em;
    }

    .message .top .timestamp {
        font-size: 0.8em;
        opacity: 0.7;
    }

    .message .text {
        white-space: pre-line;
        word-break: break-all;
        text-align: left;
    }

    .input {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        width: 100%;
    }

    .input :global(input) {
        width: unset;
    }

    svg {
        width: 2em;
    }

    @media (max-width: 640px) {
        .chat {
            height: 50vh;
        }
    }
</style>

<script>
    import { socketStore, userStore, roomStore } from './store.js'
    import Button from './Button.svelte'
    import SubmitField from './SubmitField.svelte'
    import TextField from './TextField.svelte'
    let username = 'Loading...'
    let roomCode = ''
    let joinMode = false
    let btnDisabled = true
    let roomCodeValid = false
    
    userStore.subscribe(() => {
        username = $userStore.username ? $userStore.username : ''
        btnDisabled = username.length == 0
    })

    $: {
        btnDisabled = username.length == 0
    }

    const handleRoomCodeInput = (e) => {
        if (!e.target.value.match(/^[a-zA-Z0-9]{0,5}$/)) {
            e.target.value = roomCode;
        }
        roomCode = e.target.value = e.target.value.toUpperCase();
        roomCodeValid = roomCode && roomCode.match(/^[A-Z0-9]{5}$/)
        if (roomCodeValid) {
            $socketStore.emit('getRoomById', { id: roomCode }, (room) => {
                roomCodeValid = Boolean(room)
            })
        }
    }

    const handleRoomCodeSubmit = () => {
        if (!roomCodeValid) return
        $socketStore.emit('joinRoom', { id: roomCode }, (room) => {
            if (room.error) return
            $roomStore = room
            // console.log("roomStore", $roomStore)
        });
    }

    const handleCreateClick = () => {
        handleUsernameSubmit()
        $socketStore.emit('createRoom', (room) => {
            // console.log('createRoom', room)
            $roomStore = room
        });
    }

    const handleUsernameSubmit = () => {
        $socketStore.auth = { username };
        $socketStore.connect();
        if (username != $userStore.username) {
            $socketStore.emit('setUsername', { username: username }, (user) => {
                $userStore = user
            });
        }
    }
</script>

<div class="join">
	{#if !joinMode}
		<TextField placeholder="Username" bind:value={username} />
        <div class="buttons">
			<Button on:click|once={handleCreateClick} disabled={btnDisabled}>Create Game</Button>
			<Button
				on:click|once={() => {
					joinMode = !joinMode;
                    handleUsernameSubmit();
				}}
				disabled={btnDisabled}>Join Game</Button
			>
		</div>
	{:else}
        <button class="btn-cancel" on:click={() => {joinMode = false}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
		<SubmitField valid={roomCodeValid}>
			<TextField slot="input" placeholder="Room Code" enterkeyhint="go" on:input={handleRoomCodeInput} on:submit={handleRoomCodeSubmit} />
			<Button slot="button" on:click|once={handleRoomCodeSubmit} disabled={!roomCodeValid}>
				<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</Button>
		</SubmitField>
	{/if}
</div>

<style>
	.join {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
        gap: 0.9em;
	}

	.buttons {
		display: flex;
        order: 2;
		justify-content: space-around;
		align-items: center;
		gap: 10px;
	}

	.btn-icon, .btn-cancel {
		height: 1rem;
		width: 1rem;
	}

    .btn-cancel {
        color: #776e65;
    }

    @media (max-width: 640px) {
        .join {
            zoom: 1.3;
        }
    }
</style>

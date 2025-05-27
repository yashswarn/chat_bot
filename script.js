const user_input = document.getElementById("userInput");
const send_btn = document.getElementById("send-btn");
const chat_box = document.getElementsByClassName("chat-box");
const chatBotToggler = document.querySelector(".chatbot-toggler")
// const chatBotCloserBtn = document.querySelector(".chatbot-toggler")

let userMessage;

const createChatLi = (message,className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing"? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span> <p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

async function generateResponse(incomingChatli) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBjKB5B8V5-AIu1ljpGuOVkDtl6g96edn0', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: userMessage
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content?.parts?.[0]?.text || "No valid response.";
            incomingChatli.querySelector('p').textContent = reply;
            scrollToBottom();
        } else {
            incomingChatli.querySelector('p').textContent = "No response from API";
        }

    } catch (error) {
        console.log("Error is->", error);
        incomingChatli.querySelector('p').textContent = "Error: " + error.message;
    }
}

const handleChat=()=>{
    userMessage=user_input.value.trim();
    if (!userMessage) {
        alert("enter some input bhai!")
        return ;
    }

    chat_box[0].appendChild(createChatLi(userMessage,"outgoing"));
    scrollToBottom();

    setTimeout(()=>{
        const incomingChatli=createChatLi("Thinking...","incoming");
        chat_box[0].appendChild(incomingChatli);
        scrollToBottom();
        generateResponse(incomingChatli);
    },600)
    user_input.value="";
}

send_btn.addEventListener('click',handleChat);

user_input.addEventListener('keypress',function(event){
    if(event.key==="Enter"){
        handleChat();
    }
})

function scrollToBottom(){
    chat_box[0].scrollTop=chat_box[0].scrollHeight;
}



user_input.addEventListener("input",()=>{
    // adjust the height of the input textarea based on its content
    user_input.style.height=`${inputInitHeight}px`;
    user_input.style.height=`${user_input.scrollHeight}px`
})

chatBotToggler.addEventListener("click",()=>document.body.classList.toggle("show_chatbot"));
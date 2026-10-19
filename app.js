const STORAGE_KEY = "kyro-demo-state-v1";
const starterChats = [
  {id:"mira",name:"Mira Shah",username:"@mirashah",initial:"M",color:"pink",preview:"That sounds like a plan ✨",time:"10:42",unread:2,messages:[
    {id:"m1",mine:false,text:"Hey! Welcome to KYRO 👋",time:"10:39"},
    {id:"m2",mine:false,text:"This is a local preview, so you can try the chat interface.",time:"10:40"},
    {id:"m3",mine:true,text:"Looks clean! I’m testing the app.",time:"10:41"},
    {id:"m4",mine:false,text:"That sounds like a plan ✨",time:"10:42"}
  ]},
  {id:"dev",name:"Dev Community",username:"Group · 8 members",initial:"D",color:"blue",preview:"Aarav: Build looks good!",time:"09:18",unread:0,messages:[
    {id:"d1",mine:false,text:"Aarav: Build looks good!",time:"09:18"},
    {id:"d2",mine:false,text:"This sample group is only stored on this device.",time:"09:19"}
  ]},
  {id:"riya",name:"Riya Verma",username:"@riyav",initial:"R",color:"gold",preview:"Send me the details when free.",time:"Yesterday",unread:0,messages:[
    {id:"r1",mine:false,text:"Send me the details when free.",time:"Yesterday"}
  ]}
];
let state = loadState();
let activeChatId = null;
let toastTimer;

function loadState(){
  try { const saved = localStorage.getItem(STORAGE_KEY); if(saved) return JSON.parse(saved); } catch(e) {}
  return {chats:starterChats};
}
function saveState(){ try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){} }
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function initials(name){return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"K";}
function nowTime(){return new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});}
function showToast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
function getActiveChat(){return state.chats.find(c=>c.id===activeChatId);}
function renderChats(){
  const q=document.getElementById("searchInput").value.toLowerCase().trim();
  const filtered=state.chats.filter(c=>(c.name+" "+c.username+" "+(c.preview||"")).toLowerCase().includes(q));
  document.getElementById("chatCount").textContent=state.chats.length;
  const list=document.getElementById("chatList");
  if(!filtered.length){list.innerHTML='<div style="padding:24px 14px;color:#929bad;font-size:12px;line-height:1.6">No chats found.<br>Try another search.</div>';return;}
  list.innerHTML=filtered.map(c=>`<div class="chat-item ${c.id===activeChatId?"active":""}" data-chat-id="${escapeHTML(c.id)}" role="button" tabindex="0">
    <div class="avatar ${escapeHTML(c.color||"")}">${escapeHTML(c.initial||initials(c.name))}</div>
    <div class="chat-copy"><div class="chat-top"><strong>${escapeHTML(c.name)}</strong><span class="chat-time">${escapeHTML(c.time||"")}</span></div>
    <div class="chat-bottom"><span class="chat-preview">${escapeHTML(c.preview||"No messages yet")}</span>${c.unread?`<span class="unread">${c.unread}</span>`:""}</div></div></div>`).join("");
  list.querySelectorAll("[data-chat-id]").forEach(el=>{
    el.addEventListener("click",()=>openChat(el.dataset.chatId));
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openChat(el.dataset.chatId);}});
  });
}
function openChat(id){
  const chat=state.chats.find(c=>c.id===id);if(!chat)return;
  activeChatId=id;chat.unread=0;saveState();
  document.getElementById("welcomeState").classList.add("hidden");
  document.getElementById("conversation").classList.remove("hidden");
  document.getElementById("headerAvatar").textContent=chat.initial||initials(chat.name);
  document.getElementById("headerAvatar").className="avatar "+(chat.color||"");
  document.getElementById("headerName").textContent=chat.name;
  document.getElementById("headerStatus").innerHTML='<i class="status-dot"></i> Local demo conversation';
  renderChats();renderMessages();document.getElementById("messageInput").focus();
  document.getElementById("sidebar").classList.remove("open");
}
function renderMessages(){
  const chat=getActiveChat();if(!chat)return;
  const list=document.getElementById("messagesList");
  if(!chat.messages.length){list.innerHTML='<div style="text-align:center;color:#7e899a;font-size:12px;padding:40px 0">Say hello to start this conversation.</div>';return;}
  list.innerHTML=chat.messages.map(m=>`<div class="message-row ${m.mine?"mine":""}"><div class="message-bubble">${escapeHTML(m.text)}</div><div class="message-meta"><span>${escapeHTML(m.time||"")}</span>${m.mine?'<span>✓</span>':""}</div></div>`).join("");
  const area=document.getElementById("messagesArea");area.scrollTop=area.scrollHeight;
}
function sendMessage(text){
  const chat=getActiveChat();if(!chat||!text.trim())return;
  const msg={id:"msg-"+Date.now()+"-"+Math.random().toString(16).slice(2),mine:true,text:text.trim(),time:nowTime()};
  chat.messages.push(msg);chat.preview=msg.text;chat.time=msg.time;saveState();renderMessages();renderChats();
}
function showDialog({title,description,label,placeholder,confirmText="Continue",onConfirm}){
  const dlg=document.getElementById("simpleDialog"),input=document.getElementById("dialogInput");
  document.getElementById("dialogTitle").textContent=title;
  document.getElementById("dialogDescription").textContent=description;
  document.getElementById("dialogLabel").textContent=label;
  input.placeholder=placeholder;input.value="";
  const confirm=document.getElementById("dialogConfirm");confirm.textContent=confirmText;
  const form=document.getElementById("dialogForm");
  form.onsubmit=(e)=>{if(e.submitter?.value==="cancel")return;e.preventDefault();const value=input.value.trim();if(!value){input.focus();return;}dlg.close();onConfirm(value);};
  dlg.showModal();setTimeout(()=>input.focus(),50);
}
function createChat(){
  showDialog({title:"New conversation",description:"Create a local demo chat. Real user discovery needs a connected backend.",label:"Display name",placeholder:"e.g. Riya Sharma",onConfirm:name=>{
    const id="local-"+Date.now();const chat={id,name,username:"Local demo",initial:initials(name),color:["pink","blue","gold"][state.chats.length%3],preview:"No messages yet",time:nowTime(),unread:0,messages:[]};
    state.chats.unshift(chat);saveState();renderChats();openChat(id);showToast("Demo conversation created");
  }});
}
document.getElementById("composer").addEventListener("submit",e=>{e.preventDefault();const input=document.getElementById("messageInput");const text=input.value; if(!text.trim())return;sendMessage(text);input.value="";});
document.getElementById("searchInput").addEventListener("input",renderChats);
document.getElementById("newChatBtn").addEventListener("click",createChat);
document.getElementById("welcomeNewChat").addEventListener("click",createChat);
document.getElementById("settingsBtn").addEventListener("click",()=>showDialog({title:"KYRO settings",description:"This starter runs in local demo mode. Real accounts, syncing and notifications require a backend.",label:"Display name",placeholder:"Anurag",confirmText:"Save name",onConfirm:name=>{document.getElementById("profileName").textContent=name;showToast("Name updated for this screen");}}));
document.getElementById("chatInfoBtn").addEventListener("click",()=>{const c=getActiveChat();if(c)showToast(c.name+" · Local demo chat");});
document.getElementById("emojiBtn").addEventListener("click",()=>{const input=document.getElementById("messageInput");input.value+= " 😊";input.focus();});
document.getElementById("openSidebar").addEventListener("click",()=>document.getElementById("sidebar").classList.add("open"));
document.getElementById("openSidebarChat").addEventListener("click",()=>document.getElementById("sidebar").classList.add("open"));
document.getElementById("closeSidebar").addEventListener("click",()=>document.getElementById("sidebar").classList.remove("open"));
renderChats();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});

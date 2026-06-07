const bkbtn = document.getElementById('backBtn');
bkbtn.addEventListener('click',()=>{
    const chatpanee = document.getElementById('Chat_pane');    
    const contactpanee = document.getElementById('contact_pane');    
    let ismobile = window.innerWidth <=420;
    if(ismobile){
        contactpanee.style.display= "block";
        chatpanee.style.display= "none";
    }
});

async function LoadDashboard(){
    // checking token in localstorage
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = 'login.html';
        return ;
    }
    try{
         
        const response = await fetch("/onbording/dashboard",{
            method:'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // if token is not verified // if you are not authenticated
        if(!response.ok){      
            console.log(`error loading dashboard ${response.error}`);
            showTemporaryAlert(`Error loading dashboard: ${errorMsg}`, 5000);
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return ;

        }
        
        // when all good means u are authorized then - load the dashboard 
        const data = await response.json(); 
        RenderDashboard(data);


    }catch(err){

        console.log(`error fetching from server ${err}`);
        alert(`error fetching server ${err}`);
        window.location.href = 'login.html';
        return ;

    }
}



// rendering the dashboard (element)

const contactList = document.getElementById('contactList');
const connectedUser = document.getElementById('userId');
const currenUser = document.getElementById('currentUser');
const mboxx = document.getElementById('messagebox');
//   data -  const data = {
//              currUser:   req.user.userName,           //from jwt paload
//              currUserId: req.user.userId,             //from jwt paload
//              contacts:   usernameList,
//           } 

//data.contacts = {
//                    contactid: user._id,
//                    cuserName: user.userName,
//                    unreadCount: uUnread ? parseInt(uUnread, 10) : 0
//                }


function RenderDashboard(data){
    contactList.innerHTML = '';
    currenUser.innerText = data.currUser;
    currenUser.dataset.userrid = data.currUserId;
   
    const cons = data.contacts;
    console.log(cons);
    cons.forEach(name => {
        const li = document.createElement('li');
        
        //contact card
        li.textContent = `${name.cuserName} - ${name.unreadCount}`;     /// user username
        li.classList.add("contactCard");
        li.dataset.ruseriid = name.contactid;    /// user id _id
        
        //loding chats / and reciver details
        li.addEventListener('click',async (e)=>{
            mboxx.innerHTML='';
            connectedUser.dataset.ruserrid = '';
            connectedUser.innerHTML='';
            connectedUser.innerText=name.cuserName;
            connectedUser.dataset.ruserrid = e.currentTarget.dataset.ruseriid;       /// yha pr receiver ki uid aaye gi. kha se - har contacts me dalni pde gi
            loadchats();

        });

        

        //Event for mobile size
        li.addEventListener('click',(e)=>{
            const chatpanee = document.getElementById('Chat_pane');    
            const contactpanee = document.getElementById('contact_pane');    
            
            let ismobile = window.innerWidth <=420;
            if(ismobile){
                contactpanee.style.display= "none";
                chatpanee.style.display= "block";
                chatpanee.style.width="100%";
                
            }

        });

        contactList.appendChild(li);
    });

}



async function loadchats(){

    const connectedUser = document.getElementById('userId');
    const currenUser = document.getElementById('currentUser');
    const messageBox = document.getElementById('messagebox');

    

    const fetChat={
        senderid:currenUser.dataset.userrid.trim(),
        receiverid:connectedUser.dataset.ruserrid.trim()
    }
    
   

    // fetching chats 
    try{
        console.log('------0000000--------');
        const chatres = await fetch('/user/loadchat',{
            method:'POST',
            headers:{ 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
            body:JSON.stringify(fetChat)      // always use json.stringify(data) - to convert data into string and state the content type so at the recievers end they will know what type of data they are receving in string and how to convert it - 1) .json() - will give the exact datatype (array / object) 2) .tect()
        });
        console.log('------1111111111--------');
        
        if(!chatres.ok){
            console.log(`error loding chats for ${fetChat.receiverid} the err: ${chatres.error}`);
        }
        console.log('------22222222222222--------');
        messageBox.innerHTML='';
        
        const chatsdata= await chatres.json();
        console.log('------44444444444444--------');
        console.log(chatsdata);
    //          chatsdata = {   chats: [  {
    //                                   senderId:{_id : senderId},
    //                                   content : msg,
    //                                } ....] ,
    //                          UnreadCounts: uUnread 
    //                      }

        console.log('------555555555555--------');
        const cchats =chatsdata.chats;
        cchats.forEach((msg)=>{
            console.log('-------------999999999---------');
            
            if(msg.senderId._id === currenUser.dataset.userrid){
                
                const li = document.createElement('li');
                li.classList.add('my-message')
                li.innerText=msg.content;
                
                messageBox.appendChild(li);
                
            }
            else{
                const li = document.createElement('li');
                li.classList.add('their-message')
                li.innerText=msg.content;
                
                messageBox.appendChild(li);
                
            }
            messageBox.scrollTop = messageBox.scrollHeight;
        });



    }catch(err){
        console.log(`error loding chats for ${fetChat.receiverid} the err: ${err}`);
    }
}
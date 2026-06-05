const frm = document.getElementById('Sform');
const btn = document.getElementById('btn');

frm.addEventListener('submit',async ()=>{

    const uId = document.getElementById('uId');
    const pass = document.getElementById('pass');

    const data = {
        userName: uId.value,
        password: pass.value
    }

    if(!uId.value || !pass.value){
        throw new Error('Username / Password required');
        
    }

    const response = await fetch('/api/Signup',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });




});


const frm = document.getElementById('loginForm');
const btn = document.getElementById('sub');

// import path from 'path';
// import { fileURLToPath } from 'url';

//      // These two lines replace the old __dirname
//      const __filename = fileURLToPath(import.meta.url);
//      const __dirname  = path.dirname(__filename);

//      console.log(__dirname);


frm.addEventListener('submit',async (e)=>{
    e.preventDefault();
        
    const uId = document.getElementById('username');
    const pswd = document.getElementById('password');

    const inputdata={
        userName:uId.value,
        password:pswd.value
    }
 
    try{
    const response = await fetch('/api/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputdata)
        });
        const data = await response.json();
        if (!response.ok) {
            
            throw new Error('Login failed');
        }

        console.log(`Welcome ${uId.value}, You are logged in!!!`);
        
        localStorage.setItem('token',data.token);
        
        window.location.href = "dashboard.html";
            

    }catch(err){
        console.log(`error in fetch, error ${err}`);
    }


});

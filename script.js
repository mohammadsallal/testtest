const user = document.getElementById('usern')
const pass = document.getElementById('passw')

async function login(){
    
    const data = {
        username:user.value,
        password:pass.value
    }

    const response = await fetch('http://localhost:3000/login' , {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res =>{
        if(res.ok){
            window.location.href = './home.html'
        }else{
            alert('Login Error')
        }
    })
    .catch(err =>{
        console.error(err)
    })

    
}
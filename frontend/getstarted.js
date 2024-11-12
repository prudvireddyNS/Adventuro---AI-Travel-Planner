// Get elements
const modalMain = document.getElementById('modal_main');
const main2 = document.getElementById('main2'); // Signup form
const main3 = document.getElementById('main3'); // Login form
const closeSignup = document.getElementById('close_signup');
const closeLogin = document.getElementById('close_login');
const showLogin = document.getElementById('show_login');
const showSignup = document.getElementById('show_signup');
const getStartedBtn = document.getElementById('get_started_btn');
const sign=document.getElementById('Sign');


function showModal() {
  modalMain.style.display = 'flex'; 
}


function closeModal() {
  modalMain.style.display = 'none'; 
}


function switchToLogin() {
  main2.style.display = 'none'; 
  main3.style.display = 'flex'; 
}


function switchToSignup() {
  main3.style.display = 'none'; 
  main2.style.display = 'flex'; 
}


closeSignup.addEventListener('click', closeModal);
closeLogin.addEventListener('click', closeModal);
showLogin.addEventListener('click', (e) => {
  e.preventDefault(); 
  switchToLogin();
});
showSignup.addEventListener('click', (e) => {
  e.preventDefault(); 
  switchToSignup();
});
getStartedBtn.addEventListener('click', showModal);
sign.addEventListener('click', showModal);


window.addEventListener('click', (event) => {
  if (event.target === modalMain) {
    closeModal();
  }
});


// login handle
const loginbtn = document.querySelector('#loginbtn');
loginbtn.addEventListener('click', async() => {
  const loginemail = document.querySelector('#loginemail').value;
  const loginpassword = document.querySelector('#password').value;  
  try{
    const response=await axios.post('http://localhost:3000/auth/signin',{
      email:loginemail,
      password:loginpassword
    })
    localStorage.setItem('token', response.data.jwtToken);
    showPopup("loginsuccess",1500);
    setTimeout(()=>{
      window.location.href="/frontend/main.html"
    },1300)
    
  }catch(error){
    // alert(error.response.data.message)
    showPopup("loginfailure",1500);
    setTimeout(()=>{
      switchToSignup();
    },2000)

  }
 
  })

  // signup handle
  const createbtn=document.querySelector('#createbtn');
  createbtn.addEventListener('click',async()=>{
    const name=document.querySelector('#input1').value;
    const username=document.querySelector('#input2').value;
    const email=document.querySelector('#input3').value;
    const phonenumber = Number(document.querySelector('#input4').value);
    const password=document.querySelector('#input5').value;
    const conpassword=document.querySelector('#input6').value;
    // check whether the both password are right




    if (conpassword === password) {
      try {
          const response = await axios.post('http://localhost:3000/auth/signup', {
              name: name,
              username: username,
              email: email,
              phoneNumber: phonenumber,
              password: password
          });
          
          // Store the token in local storage
          localStorage.setItem('token', response.data.jwtToken);
          showPopup("signupsuccess", 2000);
          
          // Redirect to main page after 2 seconds
          setTimeout(() => {
              window.location.href = "/frontend/main.html";
          }, 2000);
  
      } catch (error) {
          // Log the error from the server response
          console.error(error.response.data); // Log detailed error response
          showPopup("alreadyexists", 2500); // Notify user about the issue
  
          // Optionally switch to login after 3 seconds
          setTimeout(() => {
              switchToLogin();
          }, 3000);
      }
  } else {
      showPopup("passwordnotmatch", 2500);
  }
})



































  function showPopup(status, duration) {
    const popup = document.getElementById('popup');
    const message = document.getElementById('popup-message');
    const progressBar = document.getElementById('progress-bar');
  
    // Set the message and popup class based on the status
    if (status === 'loginsuccess') {
      message.textContent = 'Login successful!';
      popup.className = 'popup success';
      progressBar.style.backgroundColor = '#4CAF50';  // Green for success
    } 
    if (status === 'alreadyexists') {
      message.textContent = 'Email already exists!';
      popup.className = 'popup failure';
      progressBar.style.backgroundColor = '#f44336';  // Red for failure
    }
    if (status === 'signupsuccess') {
      message.textContent = 'SignUp successful!';
      popup.className = 'popup success';
      progressBar.style.backgroundColor = '#4CAF50';  // Green for success
    }
    if (status === 'passwordnotmatch') {
      message.textContent = 'Passwords do not match!';
      popup.className = 'popup failure';
      progressBar.style.backgroundColor = '#f44336';  // Red for failure
    } 
    if (status === 'loginfailure') {
      message.textContent = 'Login failed. Please sign up.';
      popup.className = 'popup failure';
      progressBar.style.backgroundColor = '#f44336';  // Red for failure
    }
  
    // Reset the progress bar
    progressBar.style.width = '0';
    popup.style.display = 'block';
  
    // Reduce transition duration for faster progress bar
    progressBar.style.transition = `width ${duration / 2}ms linear`; // Make it faster by dividing duration by 2
    setTimeout(() => {
      progressBar.style.width = '100%';
    }, 10); // Slight delay to trigger the animation
  
    // Reduce time before hiding popup
    setTimeout(() => {
      popup.style.display = 'none';
    }, duration ); // Reduce the hiding time
  }
  
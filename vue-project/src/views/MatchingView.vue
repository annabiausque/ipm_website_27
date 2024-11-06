<script setup>

const style = document.createElement('style');
    style.innerHTML = `
      /************************
Tinder Template by Miami
************************/
.tbg {
    height: 720px;
    width: 400px;
}
.theader { height: 65px; }
.theader i.fa-comments {
    font-size: 40px;
}
.theader i.fa-cog {
    font-size: 40px;
}

.tlogo { width: 100px; }
.tlogo img { width: 100px; }

.tphoto {
    width: 350px;
    height: 450px;
}
.tphoto img.user-image {
    height: 80%;
  }

.tno {
    height: 120px;
    width: 120px;
    // top: 50px;
    left: 25px;
    border: 10px solid #f0f0f0;
}
.tno i {
    color: #ff695b;
    padding: 17px 28px;
}
.ti {
    background-color: #fff;
    height: 50px;
    width: 50px;
    left: 12px;
    // top: 30px;
    border: 10px solid #f0f0f0;
}
.ti .fa-info {
    font-size: 23px;
    padding: 5px 11px;
    color: #398beb;
}
.tyes {
    height: 120px;
    width: 120px;
    // top: 50px;
    left: 0px;
    border: 10px solid #f0f0f0;
}
.tyes i {
    color: #5de19c;
    padding: 20px;
}
.credit {
    width: 400px;
    height: auto;
    position: relative;
    top: 60px;
    text-align: center;
    background-color: #f0f0f0;
    padding: 2px 0px;
}
.credit a {
    font-size: 7px;
    letter-spacing: 3px;
    color: #c0c0c0;
    text-decoration: none;
    text-transform: uppercase;
    font-family: 'Helvetica', sans-serif;
    font-style: italic;
}
    `;
    document.head.appendChild(style);
</script>

<template>

  <div>
    <div class="tbg mx-auto my-0 mt-3 bg-white border border-gray-400">
  
  <div class="theader flex justify-between bg-gray-200 border-b border-gray-400">
    <div class="flex items-center text-gray-500 text-center px-5">
      <i class="fa fa-cog" aria-hidden="true"></i>
    </div>
    
    <div class="flex items-center text-center">
      <div class="tlogo w-full relative mx-0 my-auto p-2">
        Synapse
      </div>
    </div>
    
    <div class="flex items-center text-gray-500 text-center px-5">
      <i class="fa fa-comments" aria-hidden="true"></i>
    </div>
  </div>
  
  
  <div class="p-3 flex flex-col items-center">
    <div class="tphoto rounded-lg border border-gray-400 shadow-lg">
      
      <img src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" 
           class="w-full user-image "
           title="tphoto"
           alt="Tinder Photo"
      />
      
      <div class="flex justify-between">
        <div class="tname text-xl float-left p-4">Jane Doe, <span class="font-light">27</span></div>
      
        <div class="tinfo text-lg float-right text-gray-500 p-4">
          <i class="fa fa-book pr-2" aria-hidden="true"> 0</i>
          <i class="fa fa-users" aria-hidden="true"> 0</i>
        </div>
      </div>
      
      <div class="pl-4 text-gray-400">
        <span>3 km away</span>
      </div>
      
    </div>
    
    
    <div class="flex items-center justify-center w-full h-full pt-12">
      <div class="bg-white rounded-full relative text-6xl tno">
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
      <div class="ti rounded-full relative">
        <i class="fa fa-info" aria-hidden="true"></i>
      </div>
      <div class="bg-white rounded-full relative  text-6xl tyes">
        <i class="fa fa-heart" aria-hidden="true"></i>
      </div>
    </div>
    
    
  </div>
<!--   <div class="credit">
    <a href="http://themakery.jcink.net">Originally created by Miami</a>
  </div> -->
</div>
  </div>
</template>

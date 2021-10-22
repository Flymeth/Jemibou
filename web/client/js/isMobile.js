const isOnMobile = navigator.userAgent.toLocaleLowerCase().includes('mobile')
document.documentElement.setAttribute('data-mobile', isOnMobile.toString())
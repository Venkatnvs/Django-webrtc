const partcBtn = document.getElementById('participants_toogle_btn')
const partcDiv = document.getElementById('main_par_div')
const viddivch = document.getElementById('change_vdlt')
const viddivchrm = document.getElementById('remoteVideos')
let activePartc = false
let activevdiltc = false

partcBtn.onclick = () => {
    console.log(activePartc,partcDiv.style.display)
    if(activePartc){
        partcDiv.style.display = 'none';
    }
    else{
        partcDiv.style.display = 'block';
    }
    activePartc = !activePartc;
}
window.addEventListener('mouseup',function(event){
    if(event.target != partcDiv && event.target.parentNode != partcDiv && activePartc){
        partcDiv.style.display = 'none';
    }
}) 

// window.onload = () =>{
//     const viddivchrmch = document.querySelector('.videoContainer')
//     console.log(viddivchrmch)
//     viddivch.onclick = () =>{
//         if(!activevdiltc){
//             viddivchrm.style.display = 'block';
//             viddivchrmch.style.width = '300px'
//             viddivchrmch.style.height = '170px'
//         }else{
//             viddivchrm.style.display = 'flex';
//             viddivchrmch.style.width = '300px'
//             viddivchrmch.style.height = '170px'
//         }
//         activevdiltc = !activevdiltc
//     }
// }



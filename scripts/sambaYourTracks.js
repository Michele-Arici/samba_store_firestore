import { getCookie, setCookie, eraseCookie } from './sambaCookies.js';
import { getFirestore, doc, getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc, query, where, setDoc } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { firebaseConfig } from "./firebase-config.js";


const app = initializeApp(firebaseConfig);
// get realtyme databse reference
// self. to let firebase be global from other modules
self.firestore = getFirestore(app);

function logout() {
    eraseCookie("user_email"); //assegna i cookie
    eraseCookie("user_password"); //assegna i cookie
    location.reload();
}

var email = getCookie('user_email');

if (email != null) {
    var div = `<div class="nav-item dropdown">
                <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
                    <span class="avatar avatar-sm" style="background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/OOjs_UI_icon_userAvatar.svg/2048px-OOjs_UI_icon_userAvatar.svg.png)"></span>
                    <div class="d-none d-xl-block ps-2">
                        <div><strong>${email}</strong></div>
                    </div>
                </a>
                <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <a class="dropdown-item" id="logout_dropdown">Logout</a>
                </div>
            </div>`;
    document.getElementById('profile_button_browse').innerHTML = div;

    document.getElementById('logout_dropdown').addEventListener('click', (e) => {
        e.preventDefault();

        logout()
    });

    var cart = `<li class="nav-item">
                <a class="nav-link" href="./cart.html">
                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-shopping-cart" width="24" height="24"
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <circle cx="6" cy="19" r="2"></circle>
                            <circle cx="17" cy="19" r="2"></circle>
                            <path d="M17 17h-11v-14h-2"></path>
                            <path d="M6 5l14 1l-1 7h-13"></path>
                        </svg>
                    </span>
                    <span class="nav-link-title">
                        Cart
                    </span>
                </a>
            </li>`;
    document.getElementById('cart_li').innerHTML = cart;

    let log_in = `<div class="mb-4"></div>
                <div id="page_title">
                    <div class="page-header d-print-none">
                        <div class="row g-2 align-items-center">
                            <div class="col">
                                <h1 class="page-title" style="font-size: 34px; font-weight: 700;">
                                    Your purchases
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style="margin: 0.1rem 0 1rem 0;">
                <div>
                    <div class="page-header d-print-none" style="margin: 0.2rem 0 0;">
                        <h2 class="page-title" style="font-size: 17px; font-weight: 700;">
                            Tracks
                        </h2>
                    </div>
                    <div class="row g-3" id="tracks">
                        
                    </div>
                </div>
                <div id="albums">
                    <hr style="margin: 2rem 0 0.2rem 0;">
                    <div class="page-header d-print-none" style="margin: 0.2rem 0 0;">
                        <h2 class="page-title" style="font-size: 17px; font-weight: 700;">
                            Albums
                        </h2>
                    </div>

                    <div class="row row-cards" id ="album">
                        

                    </div>
                </div>`;
    document.getElementById('sign-in_div').innerHTML = log_in;


    let owned_tracks = await (getDocs(query(collection(firestore, "customers/" + getCookie('user_id'), "/owned_tracks/"))));


    owned_tracks.forEach(async item => {
        let current_track_ref = doc(firestore, "tracks/", item.data()['track']);


        let current_track_artist_ref = (await (getDoc(current_track_ref))).data()['ID_AR'];
        let current_artist_id = current_track_artist_ref.id;


        let current_track_album_ref = (await (getDoc(current_track_ref))).data()['ID_A'];
        let current_album_id = current_track_album_ref.id;


        let current_track_name = (await (getDoc(current_track_ref))).data()['name'];

        let current_track_image = (await (getDoc(current_track_ref))).data()['image'];


        let current_track_artist_name = (await (getDoc(current_track_artist_ref))).data()['name'];

        let current_track_artist_surname = (await (getDoc(current_track_artist_ref))).data()['surname'];

        let current_track_duration = (await (getDoc(current_track_ref))).data()['duration'];

        let current_track_album_name = (await (getDoc(current_track_album_ref))).data()['name'];

        let current_track_album_image = (await (getDoc(current_track_album_ref))).data()['image'];


        let current_track_seconds = current_track_duration % 60;

        if (current_track_seconds < 10) {
            current_track_duration = Math.floor(current_track_duration / 60) + ":0" + (current_track_seconds);
        } else current_track_duration = Math.floor(current_track_duration / 60) + ":" + current_track_seconds;


        let current_track_owned_track = `<div class="col-3">
                            <div class="row g-3 align-items-center">
                                <a class="col-auto">
                                    <span class="avatar" style="background-image: url(${current_track_image})"></span>
                                </a>
                                <div class="col text-truncate">
                                    <a href="./show.html?ID_A=${current_album_id}&ID_T=${item.data()['track']}" class="text-reset d-block text-truncate" style="font-weight: 500; line-height: 1;">${current_track_name}</a>
                                    <a href="./artist.html?ID_AR=${current_artist_id}" class="text-muted text-truncate mt-n1" style="font-weight: 400;">${current_track_artist_name} ${current_track_artist_surname}
                                    </a>
                                </div>
                                <div class="text-muted col-auto">
                                    ${current_track_duration}
                                </div>
                                <hr style="width:90%; margin-left:5% !important; margin-right:5% !important; margin-top:10px !important; margin-bottom:10px !important;">
                            </div>
                        </div>`;

        $("#tracks").append(current_track_owned_track);

        let current_track_being_album = `<div class="col-2">
                            <div>
                                <a href="./show.html?ID_A=${current_album_id}" class="d-block mb-1"><img style="border-radius: 5px;" src="${current_track_album_image}" class="card-img-top"></a>
                                <div class="d-flex align-items-center">
                                    <div style="line-height: 15px;">
                                        <div><strong>${current_track_album_name}</strong></div>
                                        <a href="./artist.html?ID_AR=${current_artist_id}" class="text-muted" style="font-size: 12px;"><strong>${current_track_artist_name} ${current_track_artist_surname}</strong></a>
                                    </div>
                                </div>
                            </div>
                        </div>`;

        if (!document.getElementById("album").textContent.includes(current_track_album_name)) {
            $("#album").append(current_track_being_album);
        }
        //         });

    });


} else {
    var log_in = `<div class="page page-center">
        <div class="container-tight py-4">
            <div class="empty">
                <div class="empty-img"><img src="https://preview.tabler.io/static/illustrations/undraw_quitting_time_dm8t.svg" alt="" height="128"></div>
                <p class="empty-title">You are currently not logged</p>
                <p class="empty-subtitle text-muted">
                    In order to access this page you have to make the sign-in
                </p>
                <div class="empty-action">
                    <a href="./browse.html" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signInModal">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <desc>Download more icon variants from https://tabler-icons.io/i/user</desc>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        </svg>
                        Take me to sign-in
                    </a>
                </div>
            </div>
        </div>
    </div>`;
    document.getElementById('sign-in_div').innerHTML = log_in;
}
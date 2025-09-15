// Initialize the map centered on University of Ghana
//const map = L.map('map').setView([5.6500, -0.1865], 16);


// Define base layers
const baseLayers = {
    "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satellite View": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
    }),
    "Topographic Map": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ'
    })
};


// Initialize the map with the default layer
const map = L.map('map', {
    layers: [baseLayers["Street Map"]]
}).setView([5.6500, -0.1865], 15);





// Add all base layers to the map (only one will be visible)
//Object.values(baseLayers).forEach(layer => layer.addTo(map));

// Add layer control
L.control.layers(baseLayers, null, {
    position: 'bottomright',
    collapsed: true
}).addTo(map);



// Rest of your existing code (markers, polygons, etc.) goes here...

// Add OpenStreetMap base layer
//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map);

// Custom icons for different categories
const icons = {
    academic: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    }),
    residence: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    }),
    services: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    }),
    user: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    })
};

// Location tracking variables
let userLocation = null;
let userMarker = null;
let watchId = null;
let isTracking = false;
let selectedLocationCoords = null;

// Location data with more details
const locationData = {
    'balme-library': {
        title: 'Balme Library',
        description: 'The main university library with extensive collections across all disciplines. It provides study spaces, computer labs, and research support services.',
        contacts: 'Phone: +233 30 250 0000<br>Email: library@ug.edu.gh<br>Hours: Mon-Fri 8:00am - 10:00pm, Sat 9:00am - 5:00pm',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4no4Ga9FNtETaSagp7BVA11IvRYLGf8I06nO-_twtiFlyJDRPFcB2_TThfssuusJdDT6ELLXqqe9QbAxQudiYnfmxS8xRAKz9vK2EwpP4SQOyqkzpQT_OjPSnY4MbrFmz_-VAZLX=s680-w680-h510-rw'
    },
    'great-hall': {
        title: 'Great Hall',
        description: 'The iconic Great Hall of University of Legon, used for major ceremonies including graduation and special events. Known for its distinctive architecture.',
        contacts: 'For bookings: events@ug.edu.gh',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nq0D3niudPIf-ghsKZyvm-EcPX69rpBfkSI4NGNgJ4AaPd8Sr77Vs4U4C1faB0MqO8uB5X4H4oIhH1t-mBeIy_EnGxdK6PUDixJ8Mp8onGSMrZi0GqDFXoyLcKRLasZBWvdieQ=s680-w680-h510-rw'
    },
    'humanities': {
        title: 'College of Humanities',
        description: 'Home to departments including English, History, Philosophy, Modern Languages, and the Study of Religions. Offers undergraduate and graduate programs.',
        contacts: 'Phone: +233 30 250 0000<br>Dean\'s Office: humanities@ug.edu.gh',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrqzjimDw4_YMluFtAB2-xvM8kzpJuuKLj-PndZS_Zxv14-y-VKvE98-qyTQoeiC-O7nj0VuawbPkNsvvfpTtjuy4vDTpHzZIhjNm_suY8-VVYVTyozhwNVkmZ6ikhYFjpGLapy=s680-w680-h510-rw'
    },
    'computer-science': {
        title: 'Department of Computer Science',
        description: 'Offers BSc, MSc, and PhD programs in Computer Science. Facilities include computer labs, research centers, and innovation hubs.',
        contacts: 'Phone: +233 30 250 0000<br>Email: cs@ug.edu.gh',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrWgQH_sEj3kUZPDcjAC7ur7Wk7Gd2MsowPbZZyn8i4ZdE8GrrFEd0bNuFN7Yo7ssFsGGFMQ6bN46LzBxv0vM8k0-wXs4ODyhk-BZdq5P1ikJx2eiOjyWA-dyJA2FbLNgVsgnw_uw=s680-w680-h510-rw'
    },
    'business-school': {
        title: 'University of Ghana Business School',
        description: 'Premier business education institution in West Africa offering undergraduate, graduate, and executive education programs in business administration.',
        contacts: 'Phone: +233 30 250 0000<br>Email: ugsb@ug.edu.gh',
        image: 'https://ugbs.ug.edu.gh/sites/default/files/2023-10/img_07161.jpg'
    },
    'legon-hall': {
        title: 'Legon Hall',
        description: 'One of the premier residential halls on campus, housing both undergraduate and graduate students. Features dining facilities and common areas.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4noBw5I1KhJCWX8C_UqS09vJGexpwA0BhYJHnH98cn-0-kBoYn22uaEQtPFuRNmyBSNyXKbFCqTwpggyA1A6-rMfU1V7VeYOOd8z-SvU4C2quYX4TyK7qelY9umUeqISJY1o8TQQGg=s680-w680-h510-rw'
    },
    'commonwealth-hall': {
        title: 'Commonwealth Hall',
        description: 'Male residential hall known as "Vandals". Provides accommodation and dining services for students with various social and academic facilities.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://cdn.ghanaweb.com/imagelib/pics/567/56707451.jpg'
    },
    'volta-hall': {
        title: 'Volta Hall',
        description: 'Originally an all-female hall, now co-ed. Features residential facilities, dining hall, and recreational areas for students.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ayatickets.com/uploads/venues/6687f02992a88402500172.jpg'
    },
    'cafeteria': {
        title: 'Central Cafeteria',
        description: 'Main student dining facility serving breakfast, lunch and dinner. Offers a variety of local and continental dishes.',
        contacts: 'Hours: 7:00am - 8:00pm daily',
        image: 'https://via.placeholder.com/300x200?text=Central+Cafeteria'
    },
    'hospital': {
        title: 'Legon Hospital',
        description: 'University hospital providing healthcare services to students, staff and the surrounding community. Offers emergency and outpatient services.',
        contacts: 'Emergency: +233 30 250 0000<br>Appointments: hospital@ug.edu.gh',
        image: 'https://via.placeholder.com/300x200?text=Legon+Hospital'
    },
    'UG-Stadium': {
        title: 'University of Ghana Sports Stadium', 
        description: 'University sports facilities including football stadium, tennis courts, basketball courts, swimming pool, and gymnasium.',
        contacts: 'Sports Office: +233 30 250 0000',
        image: 'https://cdn.ghanafa.org/2024/05/IMG_0156.jpeg'
    },
    'bank': {
        title: 'UG Banking Square',
        description: 'Full-service bank branches located on campus offering banking services to students, staff and visitors. Includes ATMs and Forex services',
        contacts: 'Phone: +233 30 250 0000<br>Hours: Mon-Fri 8:30am - 5:00pm',
        image: 'https://via.placeholder.com/300x200?text=Banking+Square'
    },
    'geography-dept': {
        title: 'Department of Geography and Resource Development',
        description: 'Offers undergraduate and graduate programs in Geography, Resource Development, and Environmental Science. The department is known for its research in climate change, urban planning, and sustainable development in Africa.',
        contacts: "HOD's Office Line: +233 30 260 0000",
        image: 'https://live.staticflickr.com/7161/6607498309_39b966de9b_b.jpg'
    },
    'law-school': {
        title: 'UG School of Law',
        description: 'The University of Ghana School of Law serves as the oldest law school in Ghana',
        contacts: 'Phone: +233 30 396 3750',
        image: 'https://univers.ug.edu.gh/wp-content/uploads/2023/01/UG-law.jpg'
    },
    'akuafo-hall': {
        title: 'Akuafo Hall',
        description: 'The Akuafo Hall also known as the Hall of Excellence is the Second residential Hall established in UG. It is named as Akuafo Hall in appreciation to the generous gesture of the cocoa farmers who contributed huge sums of money to its establishment',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://univers.ug.edu.gh/wp-content/uploads/2024/12/202697D4-4146-4D15-A898-C2AFA5A96F99.jpeg'
    },
    'akuafo-hall-annex': {
        title: 'Akuafo Hall Annex',
        description: 'The Akuafo Hall currently has four annex buildings, i.e. Annex A, B, C, and D. These structures were set up to support the increasing student population',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrdFnBLGc1sjsXzjeN8Kx0CQ0YlccqV7hQd0qYn0Ve4EmrSl6ozHPah8ZFUgDa7KtP_NEUAfHf_DrQB3W8__b9KAjr6SJFy-7UfuaubdFpH46Y9WTjkMFhz97PUJuzoNyWvrp2rog=s680-w680-h510-rw'
    },
    'mensah-sarbah-hall': {
        title: 'Mensah Sarbah Hall',
        description: 'Mensah Sarbah Hall is the "youngest" of the 5 traditional Halls of residence at the University of Ghana. It was opened in October 1963.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'http://webmail.ug.edu.gh/images/vik/sb/m1.jpg'
    },
    'vikings-hostel': {
        title: 'Vikings Hostel',
        description: 'This is a private hostel owned by the alumni of the Mensah Sarbah Hall. The project was funded by Cidan Ivestments Ltd.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nq6QINjMW2Ru0GCrbakXLikMPCVLar5L7FcS9igwTg7EVNW0pp54XCoVjswQHbegzSDZBQPCI2yra8msENc6saqOBmC7EvW5XixchT9aIPCNFRM-EL9PuD_o9P3kYjCmYdK0mvbYQ=s680-w680-h510-rw'
    },
    'legon-hall-annex': {
        title: 'Legon Hall Annex',
        description: 'As part of the Main Hall, the premier hall has three annex buildings. i.e. Annex A,B and C.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Annex_B_%28Akuafo_hall%29_-_panoramio_%281%29.jpg/1024px-Annex_B_%28Akuafo_hall%29_-_panoramio_%281%29.jpg'
    },
    'mensah-sarbah-annex': {
        title: 'Mensah Sarbah Annex',
        description: 'Has four annex buildings. Annex A, B, C and D.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://avatars.mds.yandex.net/get-altay/5534173/2a000001854ccf250c9a1158b17ebed545b8/orig'
    },
    'valco-trust-hostel': {
        title: 'Valco Trust Hostel',
        description: 'Valco as is popularly referred to is adjacent the Vikings Hostel and behind the Mensah Sarbah Main Hall',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://233livenews.wordpress.com/wp-content/uploads/2013/12/valco-trust-hostel.jpg?w=640'
    },
    'old-pentagon-blocks': {
        title: 'Old Pentagon Blocks',
        description: 'This is the Ghana Hostels Ltd flats that started the name Pentagon. The individual buildings that forms the old pentagon blocks are Addis-Ababa Court, Kampala Court, Dar es  Salaam Court and Nairobi Court',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://live.staticflickr.com/3744/12189828275_6a0afcb136_b.jpg'
    },
    'pent-hostel-block-a': {
        title: 'Pent Hostel Block A',
        description: 'Currently known as the Africa Union Halls, the Pent Hostels were built by SSNIT. It is arguably the most popular residential facility of the UG campus',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4zCZSAJZ7-UpDiMFz1IeDmqbu3PwB2suwiA&s'
    },
    'pent-hostel-block-b': {
        title: 'Pent Hostel Block B',
        description: 'Currently known as the Africa Union Halls, the Pent Hostels were built by SSNIT. It is arguably the most popular residential facility of the UG campus',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4zCZSAJZ7-UpDiMFz1IeDmqbu3PwB2suwiA&s'
    },
    'pent-hostel-block-c': {
        title: 'Pent Hostel Block C',
        description: 'Currently known as the Africa Union Halls, the Pent Hostels were built by SSNIT. It is arguably the most popular residential facility of the UG campus',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4zCZSAJZ7-UpDiMFz1IeDmqbu3PwB2suwiA&s'
    },
    'evandy-hostel': {
        title: 'Evandy Hostel',
        description: 'Currently Evandy Hall and this was turned into a hall after the tenancy agreement with the university elapsed and ownership transferred to University authority.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://getrooms.co/wp-content/uploads/2022/10/evandy-scaled-1.jpg'
    },
    'bani-hostel': {
        title: 'Bani Hostel',
        description: 'Initially a private hostel and later had transferred to the status of a hall after the tenancy agreement with the university had elapsed',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMohqXJvqw7LcD00w-52K776EdvHj6BaRKbA&s'
    },
    'tf-hostel': {
        title: 'TF Hostel',
        description: 'The Teachers Fund Hostel is currently known as the James Topp Nelson Yankah Hall',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://avatars.mds.yandex.net/get-altay/5235091/2a000001824ee7bc0c41afcfe92a006b7c45/L_height'
    },
     'jubilee-hall': {
        title: 'Jubilee Hall',
        description: "Opposite the International Students Hall, the Jubille Hall was built to commemorate the school's Golden Jubilee celebration",
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2023/07/jubilee3.png'
    },
     'ish-hostel': {
        title: 'International Student Hostel',
        description: 'The Teachers Fund Hostel is currently known as the James Topp Nelson Yankah Hall',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2023/07/ish.png'
    },
     'limann-hall': {
        title: 'Dr. Hilla Limann Hall',
        description: 'The first of the University of Ghana Enterprise Limited (UGEL) hostels to be completed.t was inaugurated in July 2010, during which the Vice-Chancellor announced the decision to name it after Dr. Hilla Limann, a former President of the Republic of Ghana.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/limann_silder1.png'
    },
     'kwapong-hall': {
        title: ' Alexander Kwapong Hall',
        description: 'Named after Professor Alexander Kwapong a former Vice-Chancellor and Chairman of the Council of State.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2023/07/kwapong.png'
    },
     'sey-hall': {
        title: 'Elizabeth Sey Hall',
        description: 'The second of the newer halls built by University of Ghana Enterprise Limited (UGEL) Hostels to be completed. It was inaugurated in July 2010 and was named after the first female graduate of the university, Elizabeth Frances Baaba Sey',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://framerusercontent.com/assets/jUjRWCB39vHMEIZIDuxzTT5Mc44.jpg'
    },
     'jean-nelson-hall': {
        title: 'Jean Nelson Akah Hall',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'chemistry-dept': {
        title: 'Department of Chemistry',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'home-science': {
        title: 'Department of Home Science',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'political-science': {
        title: 'Department of Political Science',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'psychology': {
        title: 'Department of Psychology',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'info-studies': {
        title: 'Department of Information Studies',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'animal-biology': {
        title: 'Department of Animal Biology',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'marine-&-fisheries': {
        title: 'Department of Marine and Fisheries Sciences',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'education-dept': {
        title: 'Department of Educational Studies and Leadership (DESL)',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'teacher-education': {
        title: 'Department of Teacher Education',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'inter-prog-office': {
        title: 'International Programmes office',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'jqb': {
        title: 'JQB Lecture Hall',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'africa-studies': {
        title: 'Institute of Africa Studies',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'adult-edu': {
        title: 'Department of Adult Education',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'archaeology': {
        title: 'Department of Archaeology',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'cont-&-dist-school': {
        title: 'School of Continuing and Distance Education',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'geology-dept': {
        title: 'Department of Geology',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'inter-affairs': {
        title: 'Centre for International Affairs',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'physics-dept': {
        title: 'Department of Physics',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'plant-&-envt-biology': {
        title: 'Department of Plant and Environmental Biology',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'pharmacy-school': {
        title: 'School of Pharmacy',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'biochem-dept': {
        title: 'Department of Biochemistry',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'nursing-and-midwifery': {
        title: 'School of Nursing and Midwifery',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'french-dept': {
        title: 'French Department',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'isser': {
        title: 'Institute of Statistical, Social and Economic Research(ISSER)',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'animal-science-dept': {
        title: 'Department Of Animal Science',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'agriecons-agricbusiness': {
        title: 'Department of Agriculture Economics and Agribusiness',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'agric-faculty': {
        title: 'Faculty of Agriculture',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'biotech-lab': {
        title: 'Biotechnology Laboratory',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'CEGENSA': {
        title: 'CEGENSA - College',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'crop-science': {
        title: 'Department Of Crop Science',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'music-dept': {
        title: 'Department of Music',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'CERGIS': {
        title: 'RS/GIS Lab - Research institute',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'econs-dept': {
        title: 'Department Of Economics',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'research-office': {
        title: 'Research and Innovation Office Complex',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'biomed-dept': {
        title: 'Biomedical Engineering Department',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'N-block': {
        title: 'New N Block',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'c3ss': {
        title: 'Centre for Climate Change and Sustainability Studies-C3SS',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'GCB-lecture-hall': {
        title: 'GCB Lecture Building',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'sociology-dept': {
        title: 'Sociology Department',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'GRASAG': {
        title: 'School of Graduate studies',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'modern-langs': {
        title: 'Department of Modern Languages',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'history-dept': {
        title: 'Department Of History',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'MIASA': {
        title: 'Merian Institute for Advanced Studies in Africa (MIASA) - Research institute',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'maison-francaise': {
        title: 'Maison Française Legon - Educational institution',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'soil-science': {
        title: 'Department of Soil Science',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'fam-and-consumer': {
        title: 'Department Of Family And Consumer Science',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'UG-creche-kg': {
        title: 'UG Creche and Kindergarten School',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'mfodwo': {
        title: 'Mfodwo Complex/ N Block - Training center',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'socioso': {
        title: 'School of Social Sciences',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'CSPS': {
        title: 'CSPS - Centre for Social Policy Studies',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'religions': {
        title: 'Department for the Study of Religions - Research Institute',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'philosophy-&-classics': {
        title: 'Department Of Philosophy and Classics - Research Institute',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'economic-policy': {
        title: 'Economic Policy Management Programme Office - Research Institute',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'public-health': {
        title: 'School of Public Health',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'maths-dept': {
        title: 'Department of Mathematics',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'stats-dept': {
        title: 'Department of Statistics',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'WAGMC': {
        title: 'West African Genetic Medicine Centre - WAGMC',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'engineering': {
        title: 'School of Engineering Sciences',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'performing-arts': {
        title: 'School of Performing Arts',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'ecowas-coastal-marine': {
        title: 'ECOWAS Coastal & Marine Resources Management Centre',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
    'ghkorea-info': {
        title: 'Ghana Korea Information Access Centre',
        description: 'Named after an alumnus, Jean Nelson Akah. It was inaugurated in July 2010. Its emblem shows a candle, a book and a pen to symbolize perseverance.',
        contacts: 'Hall Office: +233 30 250 0000',
        image: 'https://ugel.com.gh/wp-content/uploads/2016/03/jean2.png'
    },
};

// Function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Function to update distance display
function updateDistanceDisplay() {
    if (userLocation && selectedLocationCoords) {
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            selectedLocationCoords[0], selectedLocationCoords[1]
        );
        
        const distanceText = distance < 1 ? 
            `${Math.round(distance * 1000)}m` : 
            `${distance.toFixed(2)}km`;
        
        document.getElementById('distance-text').textContent = distanceText;
        document.getElementById('distance-info').style.display = 'block';
    } else {
        document.getElementById('distance-info').style.display = 'none';
    }
}

// Function to handle successful location
function onLocationFound(e) {
    userLocation = e.latlng;
    
    // Remove existing user marker
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    
    // Add new user marker
    userMarker = L.marker(e.latlng, {
        icon: icons.user
    }).addTo(map);
    
    userMarker.bindPopup("<b>You are here!</b><br>Your current location").openPopup();
    
    // Update status
    document.getElementById('location-text').innerHTML = 
        `<i class="fas fa-check-circle" style="color: green;"></i> Location found! 
         <br><small>Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}</small>`;
    
    // Enable tracking button
    document.getElementById('watch-location').disabled = false;
    
    // Update distance if location is selected
    updateDistanceDisplay();
}

// Function to handle location error
function onLocationError(e) {
    document.getElementById('location-text').innerHTML = 
        `<i class="fas fa-exclamation-triangle" style="color: red;"></i> ${e.message}`;
}

// Function to find user location (one-time)
function findUserLocation() {
    if (!navigator.geolocation) {
        document.getElementById('location-text').innerHTML = 
            '<i class="fas fa-exclamation-triangle" style="color: red;"></i> Geolocation not supported';
        return;
    }
    
    document.getElementById('location-text').innerHTML = 
        '<i class="fas fa-spinner fa-spin"></i> Finding your location...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const e = {
                latlng: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            };
            onLocationFound(e);
            map.setView(e.latlng, 18);
        },
        (error) => {
            onLocationError({ message: 'Could not get your location' });
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// Function to start/stop location tracking
function toggleLocationTracking() {
    if (!isTracking) {
        // Start tracking
        if (!navigator.geolocation) {
            alert('Geolocation not supported');
            return;
        }
        
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const e = {
                    latlng: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                };
                onLocationFound(e);
                updateDistanceDisplay();
            },
            (error) => {
                onLocationError({ message: 'Tracking failed' });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000
            }
        );
        
        isTracking = true;
        document.getElementById('watch-location').innerHTML = 
            '<i class="fas fa-stop"></i> Stop Tracking';
        document.getElementById('watch-location').style.backgroundColor = '#f44336';
        document.getElementById('location-text').innerHTML = 
            '<i class="fas fa-satellite-dish" style="color: green;"></i> Tracking your location...';
    } else {
        // Stop tracking
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
        
        isTracking = false;
        document.getElementById('watch-location').innerHTML = 
            '<i class="fas fa-satellite-dish"></i> Track Me';
        document.getElementById('watch-location').style.backgroundColor = '#2196f3';
        document.getElementById('location-text').innerHTML = 
            '<i class="fas fa-check-circle" style="color: green;"></i> Location tracking stopped';
    }
}

// Event listeners for location buttons
document.getElementById('find-location').addEventListener('click', findUserLocation);
document.getElementById('watch-location').addEventListener('click', toggleLocationTracking);

// Add markers to the map and set up click handlers
document.querySelectorAll('.location-item').forEach(item => {
    const locationId = item.getAttribute('data-location');
    const coords = item.getAttribute('data-coords').split(',').map(Number);
    const category = item.closest('.location-list').id.replace('-list', '');
    
    // Create marker
    const marker = L.marker([coords[0], coords[1]], {
        icon: icons[category]
    }).addTo(map);
    
    // Bind popup with basic info
    marker.bindPopup(`<b>${locationData[locationId].title}</b> <br>${locationData[locationId].description.split('.')[0]}.`);
    
    // Click handler for sidebar items
    item.addEventListener('click', () => {
        // Store selected location coordinates
        selectedLocationCoords = coords;
        
        // Highlight selected item
        document.querySelectorAll('.location-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Show details
        const details = document.getElementById('location-details');
        details.classList.add('active');
        document.getElementById('detail-title').textContent = locationData[locationId].title;
        document.getElementById('detail-image').src = locationData[locationId].image;
        document.getElementById('detail-image').alt = locationData[locationId].title;
        document.getElementById('detail-description').innerHTML = locationData[locationId].description;
        document.getElementById('detail-contacts').innerHTML = locationData[locationId].contacts;
        
        // Update distance display
        updateDistanceDisplay();
        
        // Pan to marker
        map.panTo([coords[0], coords[1]]);
        
        // Open popup
        marker.openPopup();
    });
    
    // Click handler for markers
    marker.on('click', () => {
        // Find corresponding sidebar item and trigger click
        const correspondingItem = document.querySelector(`.location-item[data-location="${locationId}"]`);
        if (correspondingItem) {
            correspondingItem.click();
        }
    });
});

// Category toggle functionality
document.querySelectorAll('.category-title').forEach(title => {
    title.addEventListener('click', () => {
        const category = title.getAttribute('data-category');
        const list = document.getElementById(`${category}-list`);
        
        title.classList.toggle('collapsed');
        list.classList.toggle('collapsed');
    });
});

// Close details panel
document.querySelector('.close-details').addEventListener('click', () => {
    document.getElementById('location-details').classList.remove('active');
    document.querySelectorAll('.location-item').forEach(i => i.classList.remove('active'));
    selectedLocationCoords = null;
    updateDistanceDisplay();
});

// Search functionality
document.querySelector('.search-box').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    document.querySelectorAll('.location-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
            
            // Expand parent category if match found
            const categoryList = item.closest('.location-list');
            if (categoryList.classList.contains('collapsed')) {
                const categoryTitle = document.querySelector(`.category-title[data-category="${categoryList.id.replace('-list', '')}"]`);
                categoryTitle.classList.remove('collapsed');
                categoryList.classList.remove('collapsed');
            }
        } else {
            item.style.display = 'none';
        }
    });
});

// campus boundary coordinates 
const campusBoundaryCoords = [
    [5.6673,-0.1772],
    [5.6653,-0.1776],
    [5.6625,-0.1783],
    [5.66,-0.1789],
    [5.66,-0.1783],
    [5.66,-0.1774],
    [5.6599,-0.1759],
    [5.66,-0.1736],
    [5.6599,-0.1722],
    [5.66,-0.171],
    [5.66,-0.1702],
    [5.66,-0.169],
    [5.6598,-0.1689],
    [5.6571,-0.169],
    [5.654,-0.169],
    [5.6531,-0.169],
    [5.6524,-0.1691],
    [5.652,-0.169],
    [5.6498,-0.1691],
    [5.6492,-0.1692],
    [5.6484,-0.1692],
    [5.6479,-0.1693],
    [5.646,-0.1691],
    [5.6451,-0.1689],
    [5.6443,-0.1688],
    [5.6434,-0.1687],
    [5.6425,-0.1688],
    [5.6424,-0.1692],
    [5.6424,-0.1699],
    [5.6424,-0.1707],
    [5.6423,-0.1711],
    [5.6423,-0.1721],
    [5.6423,-0.1754],
    [5.6423,-0.1766],
    [5.6423,-0.1785],
    [5.6407,-0.1782],
    [5.6379,-0.1778],
    [5.6357,-0.1774],
    [5.6315,-0.1771],
    [5.6314,-0.1779],
    [5.631,-0.1783],
    [5.6294,-0.1815],
    [5.6294,-0.1818],
    [5.6285,-0.1834],
    [5.6278,-0.1846],
    [5.6259,-0.1872],
    [5.6253,-0.1886],
    [5.6249,-0.1901],
    [5.6248,-0.1911],
    [5.6245,-0.1917],
    [5.6249,-0.1921],
    [5.6266,-0.1929],
    [5.6269,-0.1932],
    [5.6276,-0.1936],
    [5.6287,-0.1942],
    [5.6297,-0.195],
    [5.6301,-0.1952],
    [5.632,-0.1966],
    [5.6333,-0.1974],
    [5.6343,-0.1981],
    [5.6351,-0.1987],
    [5.6366,-0.1994],
    [5.6371,-0.1999],
    [5.6388,-0.201],
    [5.6394,-0.2013],
    [5.6402,-0.2018],
    [5.6428,-0.2035],
    [5.6435,-0.2041],
    [5.6445,-0.2046],
    [5.645,-0.205],
    [5.6456,-0.2053],
    [5.646,-0.2053],
    [5.6465,-0.2053],
    [5.6467,-0.2053],
    [5.6476,-0.2054],
    [5.6492,-0.2054],
    [5.6496,-0.2054],
    [5.6502,-0.2054],
    [5.6514,-0.2053],
    [5.6536,-0.2054],
    [5.6541,-0.2054],
    [5.6553,-0.2054],
    [5.6561,-0.2054],
    [5.6568,-0.2054],
    [5.6579,-0.2054],
    [5.6585,-0.2054],
    [5.6591,-0.2054],
    [5.6597,-0.2054],
    [5.6601,-0.2049],
    [5.6608,-0.2047],
    [5.6614,-0.204],
    [5.6615,-0.2037],
    [5.6617,-0.2035],
    [5.6619,-0.2032],
    [5.6617,-0.2027],
    [5.6615,-0.2025],
    [5.662,-0.2024],
    [5.6626,-0.2015],
    [5.6627,-0.2011],
    [5.6628,-0.2009],
    [5.6631,-0.2005],
    [5.6633,-0.2],
    [5.6633,-0.1993],
    [5.6637,-0.1987],
    [5.6638,-0.1983],
    [5.6641,-0.1979],
    [5.6642,-0.1975],
    [5.6651,-0.1955],
    [5.6655,-0.1948],
    [5.6663,-0.1926],
    [5.6667,-0.1918],
    [5.6671,-0.1908],
    [5.6674,-0.1903],
    [5.6674,-0.1889],
    [5.6676,-0.1888],
    [5.6677,-0.1879],
    [5.6674,-0.1878],
    [5.6674,-0.1868],
    [5.6673,-0.1835],
    [5.6673,-0.1794],
    [5.6673,-0.1782]
];

// Create campus boundary polygon
const campusBoundary = L.polygon(campusBoundaryCoords, {
    color: "#0056b3",       // Border color
    weight: 2.5,              // Border width
    fillColor: "#0056b3",   // Fill color
    fillOpacity: 0.08,      // Fill transparency
    smoothFactor: 1         // How much to simplify the line (1 = no simplification)
}).addTo(map);

// Add popup to the boundary
campusBoundary.bindPopup("<b>University of Ghana, Legon</b><br>Main Campus");

// Add custom controls
        const customControl = L.control({position: 'topright'});
        customControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'custom-control');
            div.innerHTML = `
                <button id="reset-view">Reset View</button>
                `;
            return div;
        };
        customControl.addTo(map);
        
        // Add control handlers
        document.getElementById('reset-view').addEventListener('click', () => {
            map.setView([5.6500, -0.1865], 15);
        });
        
    map.setMinZoom  

        
// Add advanced location control with more options
const advancedLocateControl = L.control.locate({
    position: 'bottomright',
    flyTo: true,
    keepCurrentZoomLevel: false,
    drawCircle: true,
    drawMarker: false, // We handle our own marker
    showCompass: true,
    showPopup: true,
    strings: {
        title: "Find my location",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    },
    locateOptions: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
    }
});

// Add event listeners for the locate control
advancedLocateControl.on('locationfound', function(e) {
    onLocationFound(e);
});

advancedLocateControl.on('locationerror', function(e) {
    onLocationError(e);
});

advancedLocateControl.addTo(map);

// Add scale control
L.control.scale({position: 'bottomleft'}).addTo(map);

// Add a route line between user and selected location
let routeLine = null;

function drawRoute() {
    if (userLocation && selectedLocationCoords) {
        // Remove existing route
        if (routeLine) {
            map.removeLayer(routeLine);
        }
        
        // Draw new route line
        routeLine = L.polyline([
            [userLocation.lat, userLocation.lng],
            selectedLocationCoords
        ], {
            color: '#ff6b6b',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(map);
        
        // Fit map to show both points
        const group = L.featureGroup([userMarker, routeLine]);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Function to clear route
function clearRoute() {
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
}

// Add route drawing to location selection
const originalLocationClick = document.querySelectorAll('.location-item');
originalLocationClick.forEach(item => {
    item.addEventListener('click', () => {
        setTimeout(() => {
            if (userLocation) {
                drawRoute();
            }
        }, 100);
    });
});

// Clear route when details are closed
document.querySelector('.close-details').addEventListener('click', () => {
    clearRoute();
});



// Add a compass control
const compassControl = L.control({position: 'topleft'});
compassControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'compass-control');
    div.innerHTML = `
        <div style="background: white; border-radius: 50%; padding: 10px; box-shadow: 0 1px 5px rgba(0,0,0,0.2);">
            <i class="fas fa-compass" style="font-size: 20px; color: #0056b3;"></i>
        </div>
    `;
    div.title = 'North direction';
    return div;
};
compassControl.addTo(map);

// Handle device orientation for compass (if supported)
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(e) {
        const compass = document.querySelector('.compass-control i');
        if (compass) {
            compass.style.transform = `rotate(${e.alpha || 0}deg)`;
        }
    });
}

// Add fullscreen control
const fullscreenControl = L.control({position: 'topright'});
fullscreenControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'fullscreen-control');
    div.innerHTML = `
        <button style="background: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; box-shadow: 0 1px 5px rgba(0,0,0,0.2);">
            <i class="fas fa-expand" style="font-size: 14px;"></i>
        </button>
    `;
    div.title = 'Toggle fullscreen';
    
    div.onclick = function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            div.querySelector('i').className = 'fas fa-compress';
        } else {
            document.exitFullscreen();
            div.querySelector('i').className = 'fas fa-expand';
        }
    };
    
    return div;
};
fullscreenControl.addTo(map);



// Add night mode toggle
let isNightMode = false;
const nightModeControl = L.control({position: 'topright'});
nightModeControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'night-mode-control');
    div.innerHTML = `
        <button id="night-mode-btn" style="background: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; box-shadow: 0 1px 5px rgba(0,0,0,0.2); margin-top: 5px;">
            <i class="fas fa-moon" style="font-size: 14px;"></i>
        </button>
    `;
    div.title = 'Toggle night mode';
    
    div.onclick = function() {
        isNightMode = !isNightMode;
        if (isNightMode) {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            div.querySelector('i').className = 'fas fa-sun';
        } else {
            document.body.style.filter = 'none';
            div.querySelector('i').className = 'fas fa-moon';
        }
    };
    
    return div;
};
nightModeControl.addTo(map);

// Add weather info (mock data - in real app, you'd fetch from weather API)
const weatherControl = L.control({position: 'bottomright'});
weatherControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'weather-control');
    div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.2); margin-bottom: 10px;">
            <div style="font-size: 12px; color: #666;">Accra Weather</div>
            <div style="font-size: 14px; font-weight: bold;">
                <i class="fas fa-sun" style="color: orange;"></i> 28°C
            </div>
        </div>
    `;
    return div;
};
weatherControl.addTo(map);

// Initialize map with user's location if available
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Check if user is near campus (within reasonable distance)
            const campusCenter = [5.6500, -0.1865];
            const distance = calculateDistance(userLat, userLng, campusCenter[0], campusCenter[1]);
            
            if (distance < 5) { // Within 5km of campus
                map.setView([userLat, userLng], 17);
                onLocationFound({latlng: {lat: userLat, lng: userLng}});
            }
        },
        (error) => {
            console.log('Could not get initial location:', error);
        },
        {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000
        }
    );
}

// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const sidebarContent = document.querySelector('.sidebar-content');

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    
    // Update button icon
    const icon = toggleBtn.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        icon.className = 'fas fa-chevron-right';
        // Store state in localStorage
        localStorage.setItem('sidebarCollapsed', 'true');
    } else {
        icon.className = 'fas fa-chevron-left';
        localStorage.setItem('sidebarCollapsed', 'false');
    }
    
    // Trigger map resize to adjust to new sidebar width
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

// Event listener for toggle button
toggleBtn.addEventListener('click', toggleSidebar);

// Check saved state from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed');
    if (isCollapsed === 'true') {
        sidebar.classList.add('collapsed');
        toggleBtn.querySelector('i').className = 'fas fa-chevron-right';
    }
});

// Optional: Close sidebar when clicking on map on mobile
map.on('click', function() {
    if (window.innerWidth < 768 && !sidebar.classList.contains('collapsed')) {
        toggleSidebar();
    }
});

const searchbar=document.getElementById('searchbar')
const searchbtn=document.getElementById('searchbtn')
const notfound=document.getElementById('notFound')
const weathersection=document.getElementById('weather-container')
const searchCity=document.getElementById('searchCity')

const cityName=document.querySelector('.cityName')
const date=document.querySelector('.date')
const img=document.querySelector('.icon1')
const temperature=document.querySelector('.temp')
const weather=document.querySelector('.weather')
const windSpeed=document.querySelector('.windSpeed')
const Humidity =document.querySelector('._humidity')



const forecastContainer=document.querySelector('.forecast-container')



const apiKey='38100272711a7ee94a06f8e8d6645ff2'

searchbtn.addEventListener('click',()=>{
    if (searchbar.value.trim()!=''){
        getweather(searchbar.value);

        searchbar.value='';
        searchbar.blur();
    }
    
})


 async function fetchdata(endpoint,city){
    const apiURL=(`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`)
    const res=await fetch(apiURL)
    return res.json();

}

async function getweather(city){
    const weatherdata= await fetchdata('weather',city)
    if(weatherdata.cod!=200){
        showDisplaySection(notfound)
        return
    }
    console.log(weatherdata);
    const{
        name,
        main:{temp,humidity},
        wind:{speed},
        weather:[{id,main}],
    }=weatherdata

    function getCurrentdate() {
        const currentdate=new Date();
        const options={
            weekday:'short',
            month:'short',
            day:'2-digit',
        }
        return currentdate.toLocaleDateString('en-GB',options)
    }

    cityName.textContent=name;
    temperature.textContent=`${Math.round(temp)}°C`;
    Humidity.textContent=`${humidity}`;
    windSpeed.textContent=`${speed}m/s`;
    weather.textContent=main;
    img.src=`http://127.0.0.1:5500/assets/weather/${main}.svg`
    date.textContent=getCurrentdate();

    await updateforcastinfos(city)
    
    showDisplaySection(weathersection)
    
}

async function updateforcastinfos(city) {
    const fetchforcast=await fetchdata('forecast',city)

    const timeTaken='12:00:00'
    const todayDate=new Date().toISOString().split('T')[0]
    console.log(todayDate);
    forecastContainer.innerHTML='';

    fetchforcast.list.forEach((day)=>{
        if(day.dt_txt.includes(timeTaken)){
            console.log(day);
            const{
                dt_txt:dateforcast,
                weather:[{main}],
                main:{temp},
            }=day
            const Date=dateforcast.split(' ')[0]
           

            const forecastsection=`
                        <div class="forecast-items">
                            <h5 class="dayfor">${Date}</h5>
                            <img src="assets/weather/${main}.svg" alt="cloudy" class="iconfor">
                            <h5 class="tempfor">${Math.round(temp)}°C</h5>
                        </div>`
                        forecastContainer.insertAdjacentHTML('beforeend',forecastsection)
                    }
    })

    
} 

function showDisplaySection(section) {
    [searchCity,weathersection,notfound].forEach(sec=>sec.style.display='none')
    
    section.style.display='block'

}


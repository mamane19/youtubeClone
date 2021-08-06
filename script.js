const videoCardContainer = document.querySelector(".video-container");

let api_key = "your api key";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
// let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
fetch(
  video_http +
    new URLSearchParams({
      key: api_key,
      part: "snippet, statistics",
      chart: "mostPopular",
      maxResults: 50,
      regionCode: "IN",
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.items.forEach((item) => {
      getChannelIcon(item);
    });
  })
  .catch((err) => console.log(err));

const getChannelIcon = (video_data) => {
  fetch(
    channel_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video_data.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video_data.channelThumbnail = data.items[0].snippet.thumbnails.medium.url;
      makeVideoCard(video_data);
    })
    .catch((err) => console.log(err));
};

const makeVideoCard = (data) => {
    videoCardContainer.innerHTML += `
    <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${(data.snippet.channelTitle)}</p>
                <p class="views">${numberFormater(data.statistics.viewCount) + " | " + dateFormater(data.snippet.publishedAt)}</p>
            </div>
        </div>
    </div>
    `;
}

// convert date to readable format in days, or weeks, or months, or years.
function dateFormater(date) {
  const day = new Date(date);
  const currentDate = new Date();
  const diff = Math.abs(currentDate.getTime() - day.getTime());
  const day_diff = Math.floor(diff / 1000 / 60 / 60 / 24);

  if (day_diff < 1) {
    return "today";
  } else if (day_diff < 2) {
    return "yesterday";
  } else if (day_diff < 7) {
    return day_diff + " days ago";
  } else if (day_diff < 14) {
    return "1 week ago";
  } else if (day_diff < 31) {
    return Math.ceil(day_diff / 7) + " weeks ago";
  } else if (day_diff < 62) {
    return "1 month ago";
  } else if (day_diff < 365) {
    return Math.ceil(day_diff / 30) + " months ago";
  } else if (day_diff < 730) {
    return "1 year ago";
  } else {
    return Math.ceil(day_diff / 365) + " years ago";
  }
}

function numberFormater(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num;
  }
}

// search bar

const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");

let searchLink = "https://www.youtube.com/results?search_query=";

searchBtn.addEventListener("click", () => {
  if (searchInput.value.length) {
    location.href = searchLink + searchInput.value;
  }
});

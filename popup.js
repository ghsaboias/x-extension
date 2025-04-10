document.getElementById("clearTweets").addEventListener("click", () => {
  chrome.storage.local.remove("tweets", () => {
    displayTweets();
  });
});

document.getElementById("exportTweets").addEventListener("click", () => {
  chrome.storage.local.get(["tweets"], (result) => {
    const tweets = result.tweets || [];
    const json = JSON.stringify(tweets, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_tweets.json";
    a.click();
    URL.revokeObjectURL(url);
  });
});

function displayTweets() {
  chrome.storage.local.get(["tweets"], (result) => {
    const tweetList = document.getElementById("savedTweets");
    tweetList.innerHTML = "";
    const tweets = result.tweets || [];
    tweets.forEach((tweet, index) => {
      const li = document.createElement("li");

      // Main tweet
      const poster = document.createElement("span");
      poster.className = "tweet-link";
      poster.textContent = `${tweet.username} ${tweet.handle}`;
      li.appendChild(poster);

      const timeSpan = document.createElement("span");
      timeSpan.textContent = new Date(tweet.timestamp).toLocaleString();
      li.appendChild(timeSpan);

      const textSpan = document.createElement("span");
      textSpan.textContent = tweet.text;
      textSpan.style.display = "block";
      li.appendChild(textSpan);

      // Media
      if (tweet.media && tweet.media.length > 0) {
        const mediaDiv = document.createElement("div");
        mediaDiv.className = "media-links";
        tweet.media.forEach((mediaUrl) => {
          const mediaLink = document.createElement("a");
          mediaLink.href = mediaUrl;
          mediaLink.textContent = mediaUrl.includes("/status/")
            ? "Video"
            : "Image";
          mediaLink.target = "_blank";
          mediaDiv.appendChild(mediaLink);
        });
        li.appendChild(mediaDiv);
      }

      // Quoted tweet
      if (tweet.quotedTweet) {
        const quotedDiv = document.createElement("div");
        quotedDiv.style.borderLeft = "2px solid #555";
        quotedDiv.style.paddingLeft = "10px";
        quotedDiv.style.margin = "10px 0px";
        quotedDiv.style.color = "#bbb";

        const quotedPoster = document.createElement("span");
        quotedPoster.className = "tweet-link";
        quotedPoster.textContent = `${tweet.quotedTweet.username} ${tweet.quotedTweet.handle}`;
        quotedPoster.style.color = "#bbb";
        quotedDiv.appendChild(quotedPoster);

        const quotedTime = document.createElement("span");
        quotedTime.textContent = new Date(
          tweet.quotedTweet.timestamp
        ).toLocaleString();
        quotedDiv.appendChild(quotedTime);

        const quotedText = document.createElement("span");
        quotedText.textContent = tweet.quotedTweet.text;
        quotedText.style.display = "block";
        quotedDiv.appendChild(quotedText);

        li.appendChild(quotedDiv);
      }

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        deleteTweet(index);
      });
      buttonContainer.appendChild(deleteBtn);

      const linkBtn = document.createElement("button");
      linkBtn.textContent = "Link";
      linkBtn.className = "link-btn";
      linkBtn.addEventListener("click", () => {
        window.open(tweet.url, "_blank");
      });
      buttonContainer.appendChild(linkBtn);

      li.appendChild(buttonContainer);

      tweetList.appendChild(li);
    });
  });
}

function deleteTweet(index) {
  chrome.storage.local.get(["tweets"], (result) => {
    const tweets = result.tweets || [];
    tweets.splice(index, 1);
    chrome.storage.local.set({ tweets }, () => {
      displayTweets();
    });
  });
}

displayTweets();

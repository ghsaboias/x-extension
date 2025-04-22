// Add save buttons on initial load
addSaveButtons();

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    addSaveButtons();
  });
});
observer.observe(document.body, { childList: true, subtree: true });

function addSaveButtons() {
  const tweetElements = document.querySelectorAll(
    'article[data-testid="tweet"]'
  );
  tweetElements.forEach((tweetElement) => {
    if (tweetElement.querySelector(".save-tweet-btn")) return;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "save-tweet-btn";
    saveButton.style.margin = "5px";
    saveButton.style.backgroundColor = "#1DA1F2";
    saveButton.style.color = "#fff";
    saveButton.style.border = "none";
    saveButton.style.padding = "5px 10px";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";
    saveButton.style.fontFamily = "Roboto, sans-serif";
    saveButton.style.transition = "background-color 0.2s";
    saveButton.addEventListener("mouseover", () => {
      saveButton.style.backgroundColor = "#1991DA";
    });
    saveButton.addEventListener("mouseout", () => {
      saveButton.style.backgroundColor = "#1DA1F2";
    });
    saveButton.addEventListener("click", async () => {
      saveButton.disabled = true;
      saveButton.style.backgroundColor = "#34D399"; // Success green color
      saveButton.innerHTML = "Saved ✓";
      const tweet = await extractTweet(tweetElement);
      saveTweet(tweet);
    });

    const actionBar = tweetElement.querySelector('div[role="group"]');
    if (actionBar) actionBar.appendChild(saveButton);
  });
}

async function extractTweet(tweetElement) {
  const userNameElement = tweetElement.querySelector(
    'div[data-testid="User-Name"]'
  );
  const username =
    userNameElement?.querySelector("a")?.textContent || "Unknown";
  const handleLink = userNameElement?.querySelector('a[href^="/"]');
  const handle = handleLink
    ? `@${handleLink.getAttribute("href").substring(1)}`
    : "@Unknown";

  const showMoreButton = tweetElement.querySelector(
    'button[data-testid="tweet-text-show-more-link"]'
  );
  let text = "";
  if (showMoreButton) {
    showMoreButton.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
    text =
      tweetElement.querySelector('div[data-testid="tweetText"]')?.textContent ||
      "No text";
  } else {
    text =
      tweetElement.querySelector('div[data-testid="tweetText"]')?.textContent ||
      "No text";
  }

  const timestamp =
    tweetElement.querySelector("time")?.getAttribute("datetime") || "No time";
  const tweetUrl =
    tweetElement.querySelector('a[href*="/status/"]')?.href || "";

  const media = [];
  const images = tweetElement.querySelectorAll('img[src*="media"]');
  images.forEach((img) => {
    const src = img.src;
    if (src && !media.includes(src)) media.push(src);
  });
  const videoElement = tweetElement.querySelector("video");
  if (videoElement && tweetUrl) {
    if (!media.includes(tweetUrl)) media.push(tweetUrl);
  }

  // Extract quoted tweet if present
  let quotedTweet = null;
  const quotedElement = Array.from(
    tweetElement.querySelectorAll('div[role="link"]')
  ).find((el) => el.querySelector('div[data-testid="User-Name"]'));
  if (quotedElement) {
    const quotedUserNameElement = quotedElement.querySelector(
      'div[data-testid="User-Name"]'
    );
    const quotedUsername =
      quotedUserNameElement?.querySelector('div[dir="ltr"] > span')
        ?.textContent || "Unknown";

    const quotedMetaContainer = quotedUserNameElement.children[1];
    const quotedHandleSpan = Array.from(
      quotedMetaContainer.querySelectorAll('div[dir="ltr"] > span')
    ).find((span) => span.textContent.startsWith("@"));
    const quotedHandle = quotedHandleSpan
      ? quotedHandleSpan.textContent
      : "@Unknown";

    const quotedText =
      quotedElement.querySelector('div[data-testid="tweetText"]')
        ?.textContent || "No text";
    const quotedTimestamp =
      quotedElement.querySelector("time")?.getAttribute("datetime") ||
      "No time";
    const quotedUrl = quotedElement.href || "";

    quotedTweet = {
      username: quotedUsername,
      handle: quotedHandle,
      text: quotedText,
      timestamp: quotedTimestamp,
      url: quotedUrl,
    };
  }

  return {
    username,
    handle,
    text,
    timestamp,
    media,
    url: tweetUrl,
    quotedTweet,
  };
}

function saveTweet(tweet) {
  chrome.storage.local.get(["tweets"], (result) => {
    const tweets = result.tweets || [];
    tweets.push(tweet);
    chrome.storage.local.set({ tweets }, () => {
      console.log("Tweet saved:", tweet);
    });
  });
}

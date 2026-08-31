import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://b1aa58c5a14ac902ca2b9f05ccc96483@o4511846532120576.ingest.us.sentry.io/4511850667180032",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});
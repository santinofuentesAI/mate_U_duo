export async function skipIntro(context) {
  await context.addInitScript(() => {
    localStorage.setItem('mate-u-duo.intro.v1', '1');
  });
}

import { chromium } from 'playwright'
import notifier from 'node-notifier'
import cron from 'node-cron'

const browser = await chromium.launch()
cron.schedule("* * * * *", async () => {
  console.log(`Running on: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Buenos_Aires' })}`)

  const page = await browser.newPage()
  await page.goto('https://www.zonakids.com/productos/pack-x-25-sobres-de-figuritas-fifa-world-cup-qatar-2022/')

  const content = await page.inputValue('#product_form input[type="submit"]')

  if (content === 'Sin stock') {
    console.log('SIN STOCK')
  } else {
    notifier.notify({
      title: 'HAY FIGURITAS!!',
      message: `Se detectó stock en el pack x25 sobres de Panini`
    })
  }
  
  await page.close()
})
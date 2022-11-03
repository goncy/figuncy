import { chromium } from 'playwright'
import notifier from 'node-notifier'
import cron from 'node-cron'
import fetch from 'isomorphic-unfetch'

const BOT_KEY = ``
const PAGE = 'https://www.zonakids.com/productos/pack-x-25-sobres-de-figuritas-fifa-world-cup-qatar-2022/'

async function main() {
  const browser = await chromium.launch()

  cron.schedule("* * * * *", async () => {
    console.log(`Running on: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Buenos_Aires' })}`)

    const page = await browser.newPage()
    await page.goto(PAGE)
    
    const meta = page.locator('meta[property="tiendanube:stock"]');
    const content = await meta.getAttribute("content")

    if (content === '0') {
      console.log('SIN STOCK')
    } else {
      fetch(`https://api.telegram.org/bot${BOT_KEY}/sendMessage?chat_id=@figuncy&text=${encodeURIComponent(`Hay figuritas (stock ${content}): ${PAGE}`)}`)

      notifier.notify({
        title: 'HAY FIGURITAS!!',
        message: `Se detectó stock en el pack x25 sobres de Panini`
      })
    }
    
    await page.close()
  })
}

main()

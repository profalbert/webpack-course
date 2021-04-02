import $ from "jquery"


const createAnalytics = (): object => {
  let counter = 0
  let isDestroyed: boolean = false

  const listener = (): number => counter++

  $(document).on('click', listener)

  return {
    destroy() {
      $(document).off('click', listener) // todo: почему не биндим listener?
      isDestroyed = true
    },

    getClick() {
      if (isDestroyed) {
        return 'Analyticts is destroyed'
      }
      return counter
    }
  }
}


window['analytics'] = createAnalytics()
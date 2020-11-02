document.addEventListener("DOMContentLoaded",() => {

  const quoteList = document.querySelector('#quote-list')
  const newQouteForm = document.querySelector('#new-quote-form')

  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(resp => resp.json())
  .then(quotes =>{
    quotes.forEach(quote =>{
      //debugger
      quoteList.innerHTML += quoteIndex(quote)
    })
  })

  function quoteIndex(quote){
    return `<li class='quote-card' id='${quote.id}'>
      <blockquote class='blockquote'>
        <p class='mb-0'>${quote.quote}</p>
        <footer class='blockquote-footer'>${quote.author}</footer>
        <br>
        <button class='btn-success' id='like ${quote.id}'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger' id='delete ${quote.id}'>Delete</button>
      </blockquote>
    </li>`
  }

  newQouteForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = {
      quote: event.target['quote'].value,
      author: event.target['author'].value
    }

    event.target.reset()

    const reqObj = {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
    }

      fetch('http://localhost:3000/quotes', reqObj)
      .then(resp => resp.json())
      .then(quote => {
        let li = document.createElement('li')
        li.className = 'quote-card'
        li.id = `${quote.id}`
        li.innerHTML = `
        <blockquote class='blockquote'>
        <p class='mb-0'>${quote.quote}</p>
        <footer class='blockquote-footer'>${quote.author}</footer>
        <br>
        <button class='btn-success' id='like ${quote.id}'>Likes: <span>0</span></button>
        <button class='btn-danger' id='delete ${quote.id}'>Delete</button>
      </blockquote>`
        quoteList.appendChild(li)
      })   
  })

  quoteList.addEventListener('click', (event) => {
    if (event.target.className === 'btn-danger'){
      quoteId = parseInt(event.target.id.split(' ')[1])
      const formData = {
        id: quoteId
      }
      const configObj = {
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData)
      }
        fetch(`http://localhost:3000/quotes/${quoteId}`, configObj)
        let liRemove = event.target.parentNode.parentNode
        liRemove.remove()
    }
  })

  function likes(){
    quoteList.addEventListener('click', (event) => {
      if (event.target.className === 'btn-success'){
        console.log(event.target.className)
          quoteId = parseInt(event.target.id.split(' ')[1])
          const formData = {
            quoteId: quoteId
          }

          const reqObj = {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
            },
          body: JSON.stringify(formData)
        }
          fetch('http://localhost:3000/likes', reqObj)
           let likeCount = parseInt(event.target.innerText.split(' ')[1])
           likeCount += 1
          event.target.innerHTML = `Likes: <span>${likeCount}</span>`
      }
    })
  }

  likes()
})
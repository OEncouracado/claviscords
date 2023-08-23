import React from 'react'

function Claviculario() {
  return (
    <div className="border m-3">
        <div className="framechave border p-1 m-1 ">
            <i 
                className="fa fa-key d-flex flex-column chave" 
                aria-hidden="true">
                    <span className="mt-2 nomechave">
                        Chave Teste
                    </span>
            </i>
        </div>
    </div>
  )
}

export default Claviculario

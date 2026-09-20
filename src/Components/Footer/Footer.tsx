import React from 'react'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import { FaGithub } from 'react-icons/fa'
import { IoDocumentTextOutline } from 'react-icons/io5'
type Props = {}

const Footer = (props: Props) => {
  return (
    <footer>

            <div className="ticks"></div><section id="next-steps">
                <div id="docs">
                 
                      <IoDocumentTextOutline  className="text-lightBlue mb-5" />
                    <h2>Documentation</h2>
                    <p>Your questions, answered</p>
                            <a className="mt-5 block text-sm text-text-secondary underline" href="https://vite.dev/" target="_blank">
                                Development of Blockchain Technologies and Smart Contracts
                            </a>
                       
                </div>
                <div id="social">
                    
                     <FaGithub className="text-lightBlue mb-5" />
                    <h2>Source code</h2>
                    <p className="mb-5">Get the source code from github</p>
                            <a className="inline mr-4 mt-5 block text-sm text-text-secondary underline" href="https://github.com/yixiatros/certificate-dapp" target="_blank">
                                dapp
                            </a>
                       
                            <a className=" inline mt-5 block text-sm text-text-secondary underline" href="https://github.com/elisavetml/certificate-smart-contract" target="_blank">
                                Smart Contract
                            </a>
                        
                </div>
            </section>
    </footer>
  )
}

export default Footer
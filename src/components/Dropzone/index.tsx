import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import { Container } from './styles'

interface Props {
  onFileUploader: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploader }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file)

    setSelectedFileUrl(fileUrl)
    onFileUploader(file)
  }, [onFileUploader])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      { selectedFileUrl 
        ? <img src={selectedFileUrl} alt="Point thumbnai." />
        : (
            <p>
              <FiUpload />
              Imagem do estabelecimento
            </p>
          )
      }
      
    </Container>
  )
}

export default Dropzone
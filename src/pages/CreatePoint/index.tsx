import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import { toast } from 'react-toastify';

import Dropzone from '../../components/Dropzone'

import { Container, Form, Field, FieldGroup, ItemsGrid, Button, Item } from './styles';

import logo from '../../assets/logo.svg'

interface Item {
  id: string;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [initialPosition, setInitalPosition] = useState<[number, number]>([0, 0])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
  const [selectFile, setSelectFile] = useState<File>()

  const history = useHistory()

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);

      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }

    axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const cityNames = response.data.map(city => city.nome);
      
      setCities(cityNames)
    })
  }, [selectedUf])

  useEffect(() => {
    setInitalPosition([-22.933482, -47.163656])
    setSelectedPosition([-22.933482, -47.163656])
    
}, [])

  function handleSelectUF (event: ChangeEvent<HTMLSelectElement>)
  {
    const uf = event.target.value

    setSelectedUf(uf)
  }

  function handleSelectCity (event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value

    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    
    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id: string) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([ ...selectedItems, id ])
    }
  }

  async function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault()

      const { name, email, whatsapp } = formData
      const uf = selectedUf
      const city = selectedCity
      const [ latitude, longitude ] = selectedPosition
      const items = selectedItems

      const data = new FormData()

      data.append('name', name);
      data.append('email', email);
      data.append('whatsapp', whatsapp);
      data.append('uf', uf);
      data.append('city', city);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('items', items.join(', '));
      
      if(selectFile) {
        data.append('image', selectFile)
      }

      await api.post('points', data)

      toast.success('Registro criado com sucesso!');
      history.push('/')
    } catch (error) {
      toast.error('Por favor tente novamente!');
    }
  }

  return (
    <Container>
      <header>
          <img src={logo} alt="Ecoleta"/>

          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
      </header>

      <Form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <Dropzone onFileUploader={setSelectFile} />

        <fieldset>
          <legend>
            <h2>
              Dados
            </h2>
          </legend>

          <Field>
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </Field>

          <FieldGroup>
            <Field>
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </Field>
            <Field>
              <label 
                htmlFor="whatsapp"
                style={{ marginLeft: '20px' }}  
              >
                Whatsapp
              </label>
              <input 
                type="text"
                name="whatsapp"
                id="whatsapp"
                style={{ marginLeft: '20px' }}
                onChange={handleInputChange}
              />
            </Field>
          </FieldGroup>
        </fieldset>

        <Map 
          style={{ width: '100%', height: '300px' }} 
          center={initialPosition} 
          zoom={15}
          onClick={handleMapClick}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedPosition}/>  
        </Map>

        <fieldset>
          <legend>
            <h2>
              Endereço
            </h2>
            <span>
              Selecione o endereço do mapa
            </span>
          </legend>

          <FieldGroup>
            <Field>
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                name="uf" 
                id="uf" 
                value={selectedUf} 
                onChange={handleSelectUF}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => {
                  return (
                    <option key={uf} value={uf}>{uf}</option>
                  )
                })}
              </select>
            </Field>
            <Field>
              <label htmlFor="city">Cidade</label>
              <select 
                name="city" id="city" 
                style={{ marginLeft: '20px' }}
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => {
                  return (
                    <option key={city} value={city}>{city}</option>
                  )
                })}
              </select>
            </Field>
          </FieldGroup>
        </fieldset>

        <fieldset>
          <legend>
            <h2>
              Ítens de coleta
            </h2>
            <span>
              Selecione um ou mais itens abaixo
            </span>
          </legend>

          <ItemsGrid>
            {items.map(item => {
              return (
                <Item 
                  key={item.id} 
                  onClick={() => handleSelectItem(item.id)}
                  teste={selectedItems.includes(item.id) ? true : false}
                >
                  <img src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
                </Item>
              )
            })}
            
          </ItemsGrid>
        </fieldset>

        <Button type="submit">
          Cadastrar ponto de coleta
        </Button>
      </Form>
    </Container>
  );
}

export default CreatePoint;
import React from 'react';
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import { Container, Form, Field, FieldGroup, ItemsGrid, Button } from './styles';

import logo from '../../assets/logo.svg'

const CreatePoint: React.FC = () => {
  return (
    <Container>
      <header>
          <img src={logo} alt="Ecoleta"/>

          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
      </header>

      <Form>
        <h1>Cadastro do <br/> ponto de coleta</h1>

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
            />
          </Field>

          <FieldGroup>
            <Field>
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                name="email"
                id="email"
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
              />
            </Field>
          </FieldGroup>
        </fieldset>

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
              <select name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
              </select>
            </Field>
            <Field>
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" style={{ marginLeft: '20px' }}>
                <option value="0">Selecione uma cidade</option>
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
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt=""/>
              <span>Lampa</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/baterias.svg" alt=""/>
              <span>Bateria</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt=""/>
              <span>Lampa</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt=""/>
              <span>Lampa</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt=""/>
              <span>Lampa</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt=""/>
              <span>Lampa</span>
            </li>
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
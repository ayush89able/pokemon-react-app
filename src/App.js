import React, { useState, useEffect } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './services/pokemon'
import typeColors from './helpers/typeColors'

import Navbar from './components/Navbar';

import Card from '@tds/core-card'
import Box from '@tds/core-box'
import Heading from '@tds/core-heading'
import FlexGrid from '@tds/core-flex-grid'
import Paragraph from '@tds/core-paragraph'
import Button from '@tds/core-button'
import { ExpandCollapse } from '@tds/core-expand-collapse'

function App() {
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('')
  const [prevUrl, setPrevUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const initialUrl = 'https://pokeapi.co/api/v2/pokemon'

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialUrl);
      console.log(response)
      setNextUrl(response.next);
      setPrevUrl(response.previous)
      await loadingPokemon(response.results)
      setLoading(false)
    }
    fetchData()
  }, [])

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon.url)
      return pokemonRecord
    })
    )
    console.log(_pokemonData)
    setPokemonData(_pokemonData)
  };

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }


  return (
    <div>
      <Navbar />
      {loading ?
        (<h1>Loading....</h1>)
        :
        (
          <>
            <FlexGrid>
              <FlexGrid.Row>
                <FlexGrid.Col>
                  <Paragraph align='left'>
                    <Button variant='primary' onClick={prev}>Prev</Button>
                  </Paragraph>
                </FlexGrid.Col>
                <FlexGrid.Col>
                  <Paragraph align='right'>
                    <Button variant='secondary' onClick={next}>Next</Button>
                  </Paragraph>
                </FlexGrid.Col>
              </FlexGrid.Row>
              <FlexGrid.Row>
                {pokemonData.map((pokemon, i) => {
                  return (
                    <FlexGrid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
                      <Card>
                        <Box>
                          <Paragraph align='center'>
                            <Heading level='h2'>{pokemon.name.toUpperCase()}</Heading>
                          </Paragraph>
                          <Paragraph align='center'>
                            <img src={pokemon.sprites.back_default} width="150px" height="150px" alt="" />
                          </Paragraph>
                        </Box>
                        <Box>
                          <span>Pokemon Type: </span>
                          {pokemon.types.map((item) => {
                            return (
                              <span style={{
                                backgroundColor: typeColors[item.type.name], border: '1px solid black',
                                marginRight: '1em', padding: '5px', borderRadius: '35%'
                              }}>{`${item.type.name} `}
                              </span>
                            )
                          })}
                        </Box>

                        <p>Weight : {pokemon.weight}</p>
                        <p>Height : {pokemon.height}</p>

                        <ExpandCollapse tag="h2">
                          <ExpandCollapse.Panel id="features" header="Moves">
                            <Box between={3}>
                              <span>Moves: </span>
                              {pokemon.moves.map((item) => {
                                return (
                                  <>{`${item.move.name}, `}</>
                                )
                              })}
                            </Box>
                          </ExpandCollapse.Panel>
                        </ExpandCollapse>

                        <p>Base Experience : {pokemon.base_experience}</p>
                        <Box>
                          <span>Ability: </span>
                          {pokemon.abilities.map((item) => {
                            return (
                              <>{`${item.ability.name}, `}</>
                            )
                          })}
                        </Box>
                      </Card>
                    </FlexGrid.Col>
                  )
                })}
              </FlexGrid.Row>
            </FlexGrid>

          </>
        )
      }
    </div>
  );
}

export default App;

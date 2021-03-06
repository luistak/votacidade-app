import React, { useContext, useState } from 'react';
import { Button, Container, Spinner } from 'reactstrap';

import StringHelper from '../../helpers/string';

import { useForm } from 'react-hook-form';

import { ReactComponent as FindSvg } from 'assets/icons/find.svg';
import { CityContext } from '../../components/CityProvider/CityProvider';
import { MatchesContext } from 'components/MatchesProvider/MatchesProvider';
import { AnswersContext } from 'components/AnswersProvider/AnswersProvider';
import getPicture from 'constants/candidatePicture';

import ImageThumbnail from 'components/atoms/ImageThumbnail';

import {
  AffinityTag,
  ButtonWrapper,
  CandidateCard,
  CardInfo,
  CardName,
  CenteredContent,
  Description,
  Divider,
  InfoWrapper,
  PageDescription,
  PageTitle,
  ProfileLink,
} from './Ranking.styled';
import useFilterMatches from './useFiltersMatches';
import RankingFilters from './RankingFilters';
import Rating from './Rating';

export default function Ranking() {
  const [listLimiter, setListlimiter] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { matches } = useContext(MatchesContext);
  const { answers } = useContext(AnswersContext);
  const limitList = (_, index) => index < listLimiter;
  const { cityPath } = useContext(CityContext);
  const { register, control, getValues, watch, reset } = useForm();

  const formValues = getValues([
    'age',
    'gender',
    'socialGroup',
    'ethnicGroup',
    'politicalParty',
  ]);

  const countFormValues = Object.values(formValues).filter(
    (value) => value && value.length,
  ).length;

  watch();

  const filteredMatches = useFilterMatches({ matches, formValues });

  const hasMoreCandidates = filteredMatches.length > listLimiter;
  const candidatesCount =
    listLimiter < filteredMatches.length ? listLimiter : filteredMatches.length;

  const hasNoMatches = countFormValues > 0 && filteredMatches.length === 0;
  const isLoadingMatches =
    countFormValues === 0 && filteredMatches.length === 0;

  const loadMoreCandidates = async () => {
    setIsLoading(true);
    return setTimeout(() => {
      setListlimiter(listLimiter + 10);
      setIsLoading(false);
    }, 300);
  };

  if (Object.keys(answers).length < 21) {
    return (
      <Container className="py-4">
        <PageTitle>Ranking</PageTitle>
        <p>
          <strong>Eleitor(a)</strong>, para que o índice de afinidade seja
          exibido, lembre-se que você precisa responder no mínimo 21 questões.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <PageTitle>Ranking</PageTitle>

      <PageDescription>
        Quanto mais perguntas você responder, mais assertiva vai ser a
        porcentagem de afinidade! Ah, você pode filtrar os candidatos, ver o
        perfil e as respostas de cada um.
      </PageDescription>

      <Rating />

      <Divider />

      <Description>
        <strong>Candidatos(as):</strong> mostrando {candidatesCount} cadastrados
        no Vota de um total de {matches.length}
      </Description>

      <RankingFilters
        register={register}
        control={control}
        countFormValues={countFormValues}
        reset={reset}
      />

      {filteredMatches.filter(limitList).map((candidate) => (
        <div key={candidate.id} data-testid="candidate-item">
          <CandidateCard>
            <ImageThumbnail
              src={getPicture(cityPath, candidate.candidateNumber)}
              alt={`Foto de ${candidate.name}`}
              placeholderText="Foto"
              width="73px"
              height="73px"
              className="border mr-3"
            />
            <InfoWrapper>
              <CardName>{candidate.name}</CardName>
              <CardInfo>
                {candidate.candidateNumber} | {candidate.politicalParty}
              </CardInfo>
              <CardInfo>
                Afinidade:{' '}
                <AffinityTag>
                  {StringHelper.toPercentage(candidate.match)}
                </AffinityTag>
              </CardInfo>
            </InfoWrapper>
            <ProfileLink to={`${cityPath}/perfil/${candidate.id}`}>
              <FindSvg />
            </ProfileLink>
          </CandidateCard>
          <Divider />
        </div>
      ))}

      {isLoadingMatches && (
        <CenteredContent data-testid="ranking-loader">
          <Spinner color="primary" />
        </CenteredContent>
      )}

      {hasNoMatches && (
        <CenteredContent>Nenhum candidato encontrado</CenteredContent>
      )}

      {hasMoreCandidates && (
        <ButtonWrapper>
          <Button
            color="primary"
            onClick={loadMoreCandidates}
            style={{ width: '130px' }}
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="light" size="sm" /> : 'Carregar mais'}
          </Button>
        </ButtonWrapper>
      )}
    </Container>
  );
}

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";
import { inferQueryResponse } from "./api/trpc/[trpc]";

const btn =
	"inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
	const [ids, setIds] = useState([0, 0]);
	const [first, second] = ids;

	const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
	const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

	useEffect(() => {
		setIds(getOptionsForVote());
	}, []);

	if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

	const voteForRoundest = (selected: number) => {
		// todo: fire mutation to persist changes
		setIds(getOptionsForVote());
	};

	return (
		<div className="h-screen w-screen flex flex-col justify-center items-center">
			<div className="text-2xl text-center">Which Pokémon is Rounder?</div>
			<div className="p-2" />
			<div className="border rounded p-8 flex justify-between max-w-2xl items-center">
				{!firstPokemon.isLoading && !secondPokemon.isLoading && (
					<>
						<PokemonListing
							pokemon={firstPokemon.data!}
							vote={() => voteForRoundest(first)}
						/>
						<div className="p-8">Vs</div>
						<PokemonListing
							pokemon={secondPokemon.data!}
							vote={() => voteForRoundest(second)}
						/>
					</>
				)}

				<div className="p-2" />
			</div>
		</div>
	);
};

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
	pokemon: PokemonFromServer;
	vote: () => void;
}> = (props) => {
	return (
		<div className="flex flex-col items-center">
			<Image
				src={props.pokemon.sprites.front_default as string}
				alt={props.pokemon.name}
				width={96}
				height={96}
				className="w-64 h-64"
			/>
			<div className="text-xl text-center capitalize mt-[-2rem]">
				{props.pokemon.name}
			</div>
			<button className={btn} onClick={() => props.vote()}>
				Rounder
			</button>
		</div>
	);
};

export default Home;

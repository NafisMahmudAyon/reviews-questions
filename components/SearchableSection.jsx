'use client'
import { Input, Typography } from "aspect-ui";
import React, { useState, useEffect } from "react";

const SearchableSection = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [data, setData] = useState({ reviews: [], questions: [] });
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const jsonFiles = [
					"/review-maxiblocks.json",
					"/review-gutenkit.json",
					"/review-postx.json",
					"/question-maxiblocks.json",
					"/question-gutenkit.json",
				];

				const fetchPromises = jsonFiles.map((file) =>
					fetch(file).then((response) => response.json())
				);
				const results = await Promise.all(fetchPromises);

				const allReviews = results.slice(0, 3).flatMap((result) => result);
				const questions = results[3];

				setData({ reviews: allReviews, questions });
			} catch (error) {
				console.error("Error fetching data:", error);
				setError(error.message);
			}
		};

		fetchData();
	}, []);

	const handleSearch = (event) => {
		const term = event.target.value.toLowerCase();
		setSearchTerm(term);

		const searchTerms = term.split(/\s+/).filter((word) => word.length > 2);

		const filterItem = (item, fields) => {
			return searchTerms.some((searchWord) =>
				fields.some(
					(field) =>
						item[field] && item[field].toLowerCase().includes(searchWord)
				)
			);
		};

		const filteredReviews = data.reviews.filter((review) =>
			filterItem(review, ["Title", "Review"])
		);

		const filteredQuestions = data.questions.filter((question) =>
			filterItem(question, ["Question", "Details"])
		);

		setSearchResults([...filteredReviews, ...filteredQuestions]);
	};

	const highlightText = (text, searchTerms) => {
		if (!text) return "";
		const words = text.split(/\b/);
		return words.map((word, index) => {
			const lowercaseWord = word.toLowerCase();
			if (searchTerms.includes(lowercaseWord)) {
				return (
					<mark key={index} className="border border-b-warning-400">
						{word}
					</mark>
				);
			}
			return word;
		});
	};

	// Calculate pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(searchResults.length / itemsPerPage);

	console.log(totalPages)

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<Typography variant="body" className="text-body1 text-lg">
				Search Reviews and Questions
			</Typography>
			<Input
				type="text"
				placeholder="What's the advantages of using Gutenkit instead of elementor or Divi?"
				value={searchTerm}
				onChange={handleSearch}
			/>
			<div>
				{currentItems.map((item, index) => (
					<div
						key={index}
						className="mb-4 p-4 border border-gray-200 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 text-primary-800 dark:text-primary-200 hover:text-primary-900 dark:hover:text-primary-100 rounded">
						<h3 className="text-lg font-semibold mb-2">
							{highlightText(
								item.Title || item.Question,
								searchTerm.split(/\s+/).filter((word) => word.length > 1)
							)}
						</h3>
						<p className="mb-2">
							{highlightText(
								item.Review || item.Details,
								searchTerm.split(/\s+/).filter((word) => word.length > 1)
							)}
						</p>
						{item.Rating && (
							<p className="text-sm text-gray-600">Rating: {item.Rating}</p>
						)}
						{item.Date && (
							<p className="text-sm text-gray-600">Date: {item.Date}</p>
						)}
						{item.User && (
							<p className="text-sm text-gray-600">User: {item.User}</p>
						)}
						{item["Review Link"] && (
							<a
								href={item["Review Link"]}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:underline">
								View Review
							</a>
						)}
						{item.Link && (
							<a
								href={item.Link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:underline">
								View Question
							</a>
						)}
					</div>
				))}
			</div>
			{totalPages > 1 && (
				<div className="flex justify-center mt-4">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
						<button
							key={number}
							onClick={() => paginate(number)}
							className={`mx-1 px-3 py-1 border ${
								currentPage === number
									? "bg-blue-500 text-white"
									: "bg-white text-blue-500"
							}`}>
							{number}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchableSection;

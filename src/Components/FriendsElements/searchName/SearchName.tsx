import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchName } from "../../../Utils/SearchHttp";
import { List, Input } from "antd";
import { NavLink } from "react-router-dom";
export default function SearchName({ className }: { className?: string }) {
  type SearchPerson = {
    id: string;
    firstName: string;
    lastName: string;
  };
  const { Search } = Input;
  const [searchResult, setSearchResult] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const { data, isLoading } = useSearchName(searchResult);
  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value.trim().toLowerCase());
  }
  function handleClean() {
    setInput("");
    setSearchResult("");
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchResult(input.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(handler);
  }, [input]);

  return (
    <>
		<div style={{ display: 'flex', justifyContent: 'end', margin: '20px 0' }}>
			<Search
				onChange={handleSearch}
				allowClear
				placeholder="Search by name..."
				value={input}
				onClear={handleClean}
				className={className}
        
			/>
		</div>
		{data && data.length > 0 ? (
			<List
				dataSource={data.filter((item) => item !== null)}
				loading={isLoading}
				locale={{ emptyText: "No results found" }}
				renderItem={(item: SearchPerson) => (
					<List.Item>
						<NavLink to={`/profile/${item.id}`}>
							{item.firstName} {item.lastName}
						</NavLink>
					</List.Item>
				)}
			/>
		) : null}
    </>
  );
}

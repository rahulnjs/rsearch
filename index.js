const SearchResult = ({ result, first }) => {
    return <div className="result">
        <div className="link">
            <a href={result.link}>
                <div className="title">{result.h3}</div>
                <div className="breadcrumb">{result.breadcrumb}</div>
            </a>
        </div>
        {!first && <div className="snippet">{result.desc}</div>}
    </div>
}

const SearchApp = () => {
    const [results, setResults] = React.useState([]);
    const [start, setStart] = React.useState(0);
    const [searchInfo, setSearchInfo] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);

    const search = async (v) => {
        if (!v) {
            return;
        }
        setIsLoading(true);
        const d = await getSearchResults(v);
        setIsLoading(false);
        setSearchInfo(d);
        setResults(d.items);
    }


    async function getSearchResults(v) {
        const url = window.location.protocol === 'http:' ? `http://localhost:9311` : 'https://search.rahulnjs.com';
        const res = await fetch(`${url}/api/search?q=${v}`);
        return await res.json();
    }

    return <div id={`app`} className={`${results.length > 0 ? 'full' : 'compact'}`}>
        <div className="search-header">
            <div className="search-box">
                <div className="google-ico">
                    <img src="./assets/google.png" />
                </div>
                <input id="search-ip" onKeyUp={e => e.key === 'Enter' && search(e.target.value)} />
                <div className="search-ico">
                    <img src={isLoading ? "./assets/loader.gif" : "./assets/search.ico"} />
                </div>
                {results.length > 0 &&
                    <div className="search-info">
                        {searchInfo.rc} results in {searchInfo.time}s
                    </div>
                }
            </div>
        </div>
        {results.length > 0 &&
            <div>
                <div class="search-result banner-highlight">
                    {results[0].desc}
                </div>
                <div className="search-result">
                    {results.map((r, i) => <SearchResult result={r} first={i === 0} />)}
                </div>
            </div>
        }
    </div>
}


ReactDOM.render(<SearchApp />, document.querySelector('#root'));
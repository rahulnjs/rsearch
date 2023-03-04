const SearchResult = ({ result }) => {
    return <div className="result">
        <div className="link"><a href={result.link}><div className="title">{result.title}</div></a></div>
        <div className="snippet">{result.snippet}</div>
    </div>
}

const SearchApp = () => {
    const [results, setResults] = React.useState([]);
    const [start, setStart] = React.useState(0);
    const [searchInfo, setSearchInfo] = React.useState({});

    const search = async (v) => {
        if (!v) {
            return;
        }
        let all = [];
        const _results = await Promise.all([0, 1, 2].map(n => getSearchResults(v, n === 0 ? 0 : ((n * 10) + 1))));
        for (let r of _results) {
            if (r.items) {
                all = [...all, ...r.items];
            }
        }
        setSearchInfo(_results[0].searchInformation);
        setResults(all.reverse());
    }


    async function getSearchResults(v, _start = 0) {
        const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyCPM1GuOrLSRwoowPLBe3ES68RFiL0NTWo&cx=017576662512468239146:omuauf_lfve&q=${v}&start=${_start}&gl=in`);
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
                    <img src="./assets/search.ico" />
                </div>
                {results.length > 0 &&
                    <div className="search-info">
                        {searchInfo.formattedTotalResults} results in {searchInfo.formattedSearchTime}s
                    </div>
                }
            </div>
        </div>
        {results.length > 0 &&
            <div className="search-result">
                {results.map(r => <SearchResult result={r} />)}
            </div>
        }
    </div>
}


ReactDOM.render(<SearchApp />, document.querySelector('#root'));
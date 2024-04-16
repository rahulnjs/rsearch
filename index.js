const url = window.location.protocol === 'http:' ? `http://localhost:9311` : 'https://search.rahulnjs.com';
window.real = 'yes'
const isNormal = location.search.includes('normal')

const SearchResult = ({ result, first, index, q }) => {
    const id = React.useId();

    const navigateTo = async (e, link) => {
        e.preventDefault();
        const clickData = {
            link, time: Date.now(),
            at: index + 1,
            q,
            set: window.qset,
            uuid: window.localStorage['uuid'],
            original: isNormal
        };
        const res = await fetch(`${url}/api/log`, {
            method: 'POST',
            body: JSON.stringify(clickData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(res);
        window.location.assign(link);
    }

    return <div className="result" key={id}>
        <div className="link">
            <div href={result.link} onClick={e => navigateTo(e, result.link)}>
                <div className="title">{result.h3}</div>
                {result.breadcrumb && <div className="breadcrumb">{result.breadcrumb}</div>}
            </div>
        </div>
        {(!first || !window.real) && <div className="snippet">{result.desc}</div>}
    </div>
}

const SearchApp = () => {
    const [results, setResults] = React.useState([]);
    const [searchInfo, setSearchInfo] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('')



    React.useEffect(() => {
        const url = new URL(window.location);
        const set = url.searchParams.get('set');
        if (set) {
            preFillResult(set);
        }
        window.qset = set;
    }, []);


    React.useEffect(() => {
        const url = new URL(window.location);
        const v = url.searchParams.get('q');
        if (v) {
            setSearchTerm(v)
            search(v);
        }
    }, []);


    const preFillResult = (set) => {
        const data = window[`data_set_${set}`];
        setResults(data.result);
        setSearchInfo({
            rc: data.result.length,
            time: 0
        });
        setSearchTerm(data.query);
    }

    const search = async (v, e) => {
        if (!v) {
            return;
        }
        if (e) {
            e.target.blur();
        }
        if (window.real) {
            setIsLoading(true);
            const d = await getSearchResults(v);
            setIsLoading(false);
            setSearchInfo(d);
            setResults(d.items);
        } else {
            preFillResult(1);
        }
    }




    async function getSearchResults(v) {
        window.history.pushState(null, '', `?q=${v}${isNormal ? '&normal' : ''}`)
        const res = await fetch(`${url}/api/search?q=${v}${isNormal ? '&original=true' : ''}`);
        return await res.json();
    }

    return <div id={`app`} className={`${results.length > 0 ? 'full' : 'compact'}`}>
        <div className="search-header">
            <div className="search-box">
                <div className="google-ico">
                    <img src="./assets/google.png" />
                </div>
                <input id="search-ip" onKeyUp={e => {
                    if (e.key === 'Enter') {
                        search(e.target.value, e);
                    }
                }} onChange={e =>
                    setSearchTerm(e.target.value)} value={searchTerm} />
                <div className="search-ico">
                    <img src={isLoading ? "./assets/loader.gif" : "./assets/search.ico"} />
                </div>
                {results.length > 0 &&
                    <div className="search-info">
                        {searchInfo.rc} results
                        {/* in {searchInfo.time}s */}
                    </div>
                }
            </div>
        </div>
        {results.length > 0 &&
            <div>
                {window.real && <div className="search-result banner-highlight">
                    {results[0].desc}
                </div>
                }
                <div className="search-result">
                    {results.map((r, i) => <SearchResult result={r} first={i === 0} key={i} index={i} q={searchTerm} />)}
                </div>
            </div>
        }
    </div>
}


const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<SearchApp />);
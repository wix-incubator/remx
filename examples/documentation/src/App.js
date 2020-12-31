import logo from './logo.svg';
import './App.css';
import { API_URL} from "./api.js";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
     items: [],
      page: 1
    };
  }



  nextPage = () => {
    this.setState({
      page: this.state.page + 1
    });
  };

  prevPage = () => {
    this.setState({
      page: this.state.page - 1
    },
    () => {
      this.limiter();
    }
    );
    console.log("prev", this.state.page);
  };

  limiter = () => {
    if (this.state.page === 0) {
      alert("No more pages");
    }
  };


    getItems = () => {
    fetch(
      `${API_URL}/=${this.state.page}`
    )
      .then(response => {
        console.log("then");
        return response.json();
      })
      .then(data => {
        console.log("data", data);
        this.setState({
         
          items: data.results,
          page: data.page
        });
      });
  };


  render() {
    console.log("render", this.state.item);
    return (
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div className="row mb-4 mt-4">
   
            </div>
            {this.state.items.map(item => {
              return (
                <div>
                  key={item.id}
                  item={item}                                 
                </div>
              );
            })}
            <div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.prevPage}
              >
                Previous Page
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.nextPage}
              >
                Next Page
              </button>
            </div>
          </div>
          <div className="col-3">
            <p>Will Watch: {this.state.items.length} </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
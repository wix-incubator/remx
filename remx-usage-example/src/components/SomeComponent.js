import React, { PureComponent } from 'react';
import { connect } from 'remx';
import { store } from './../stores/storeExample/store';
import * as actions from './../stores/storeExample/actions';

class SomeComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  componentDidMount() {
    actions.fetchRandomJoke();
  }

  render() {
    return (
      <div>
        <h1>
Click on the button to fetch more jokes
        </h1>
        <div dangerouslySetInnerHTML={{ __html: this.props.joke }}/>
        <button onClick={() => actions.fetchRandomJoke()}>
Are you joking?
        </button>
        <h1>
Saved Jokes:
        </h1>
        <div>
          {this.props.savedJokes.map((title, index) => (
            <div key={index}>
              {title}
            </div>
))}
        </div>
        <button onClick={() => actions.addSlot()}>
Add empty slot
        </button>
        <div>
          <span>
index:
          </span>
          <input type="number" value={this.state.index} onChange={(e) => this.setState({ index: e.target.value || 0 })}/>
          <button onClick={() => actions.editSlot(this.state.index, this.props.joke)}>
Save joke
          </button>
        </div>

        {this.props.name}
      </div>
    );
  }
}

function mapStateToProps(ownProps) {
  return {
    joke: store.getRandomJoke(),
    savedJokes: store.getAllSavedJokes()
  };
}

export default connect(mapStateToProps)(SomeComponent);

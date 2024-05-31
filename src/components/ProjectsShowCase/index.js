import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]
const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}
class ProjectsShowCase extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    apiStatus: apiUrlStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount = () => {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const {activeCategory} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${activeCategory}`,
    )
    console.log(response)
    const fetchedData = await response.json()
    if (response.ok === true) {
      console.log(fetchedData)
      const updatedFetchedData = fetchedData.projects.map(data =>
        this.getUpdatedData(data),
      )
      this.setState({
        projectsList: updatedFetchedData,
        apiStatus: apiUrlStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  getUpdatedData = data => ({
    id: data.id,
    name: data.name,
    imageUrl: data.image_url,
  })

  updateActiveCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectsList)
  }

  retryAgain = () => {
    this.getProjectsList()
  }

  renderLoadingView = () => (
    <div className="projects-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-title">Oops! Something Went Wrong</h1>
      <p className="failure-view-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-btn" type="button" onClick={this.retryAgain}>
        Retry
      </button>
    </div>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list">
        {projectsList.map(project => (
          <ProjectItem project={project} key={project.id} />
        ))}
      </ul>
    )
  }

  renderShowCaseContainer = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiUrlStatusConstants.success:
        return this.renderProjectsView()
      case apiUrlStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state
    console.log(activeCategory)
    return (
      <>
        <nav className="header-container">
          <img
            className="app-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="app-container">
          <div className="options-container">
            <select
              id="optionsList"
              className="options-list"
              value={activeCategory}
              onChange={this.updateActiveCategory}
            >
              {categoriesList.map(category => (
                <option key={category.id} value={category.id}>
                  {category.displayText}
                </option>
              ))}
            </select>
          </div>
          <div className="show-case-container">
            {this.renderShowCaseContainer()}
          </div>
        </div>
      </>
    )
  }
}

export default ProjectsShowCase

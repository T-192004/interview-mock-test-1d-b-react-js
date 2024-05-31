import './index.css'

const ProjectItem = props => {
  const {project} = props
  const {name, imageUrl} = project
  return (
    <li className="project-item">
      <img className="project-img" src={imageUrl} alt={name} />
      <div className="project-content">
        <p className="project-title">{name}</p>
      </div>
    </li>
  )
}

export default ProjectItem

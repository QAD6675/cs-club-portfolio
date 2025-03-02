import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faChrome } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendar,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  auth,
  getProjects,
  updateProject,
  deleteProject,
  addProject,
} from "../firebase";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadProjects();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsList = await getProjects();
      // Ensure each project has a technologies array
      const projectsWithDefaults = projectsList.map((project) => ({
        ...project,
        technologies: project.technologies || [],
      }));
      setProjects(projectsWithDefaults);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleAdd = () => {
    setEditProject({
      title: "",
      description: "",
      technologies: [],
      githubLink: "",
      liveDemo: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsAddingNew(true);
    setEditMode(true);
  };

  const handleEdit = (project) => {
    setEditProject({
      ...project,
      technologies: project.technologies || [], // Ensure technologies array exists
    });
    setIsAddingNew(false);
    setEditMode(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...editProject,
        technologies: editProject.technologies || [], // Ensure technologies array exists
      };

      if (isAddingNew) {
        await addProject(projectData);
      } else {
        await updateProject(projectData.id, projectData);
      }
      setEditMode(false);
      setEditProject(null);
      setIsAddingNew(false);
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        loadProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const renderEditForm = () => {
    return (
      <form onSubmit={handleSave} className="project-edit-form">
        <h3>{isAddingNew ? "Add New Project" : "Edit Project"}</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={editProject.title || ""}
            onChange={(e) =>
              setEditProject({ ...editProject, title: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={editProject.description || ""}
            onChange={(e) =>
              setEditProject({ ...editProject, description: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Technologies (comma-separated):</label>
          <input
            type="text"
            value={(editProject.technologies || []).join(", ")}
            onChange={(e) =>
              setEditProject({
                ...editProject,
                technologies: e.target.value
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter((tech) => tech !== ""),
              })
            }
          />
        </div>
        <div className="form-group">
          <label>GitHub Link:</label>
          <input
            type="url"
            value={editProject.githubLink || ""}
            onChange={(e) =>
              setEditProject({ ...editProject, githubLink: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Live Demo Link (optional):</label>
          <input
            type="url"
            value={editProject.liveDemo || ""}
            onChange={(e) =>
              setEditProject({ ...editProject, liveDemo: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={editProject.date || new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setEditProject({ ...editProject, date: e.target.value })
            }
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="save-button">
            Save Project
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setEditMode(false);
              setEditProject(null);
              setIsAddingNew(false);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>Our Projects</h2>
        {isAdmin && (
          <button className="add-button" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} /> Add Project
          </button>
        )}
      </div>

      {editMode ? (
        renderEditForm()
      ) : (
        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <div className="project-date">
                  <FontAwesomeIcon icon={faCalendar} />
                  {new Date(project.date).toLocaleDateString()}
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech-stack">
                  {(project.technologies || []).map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      className="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faGithub} /> GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      className="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faChrome} /> Live Demo
                    </a>
                  )}
                </div>
                {isAdmin && (
                  <div className="admin-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(project)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(project.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-projects-message">
              <p>
                No projects available.{" "}
                {isAdmin && "Click 'Add Project' to create one."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Projects;

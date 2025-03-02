import React, { useState, useEffect } from "react";
import {
  auth,
  logoutAdmin,
  getActivities,
  getProjects,
  updateActivity,
  updateProject,
  deleteActivity,
  deleteProject,
} from "../firebase";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("activities");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin-login");
      } else {
        loadData();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [activitiesData, projectsData] = await Promise.all([
        getActivities(),
        getProjects(),
      ]);
      setActivities(activitiesData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate("/admin-login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleEdit = (item, type) => {
    setEditItem({ ...item, type });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editItem.type === "activity") {
        await updateActivity(editItem.id, editItem);
      } else {
        await updateProject(editItem.id, editItem);
      }
      setIsEditing(false);
      setEditItem(null);
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        if (type === "activity") {
          await deleteActivity(id);
        } else {
          await deleteProject(id);
        }
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const renderEditForm = () => {
    if (!editItem) return null;

    if (editItem.type === "activity") {
      return (
        <form onSubmit={handleSave} className="edit-form">
          <h3>Edit Activity</h3>
          <input
            type="text"
            value={editItem.title}
            onChange={(e) =>
              setEditItem({ ...editItem, title: e.target.value })
            }
            placeholder="Title"
          />
          <textarea
            value={editItem.content}
            onChange={(e) =>
              setEditItem({ ...editItem, content: e.target.value })
            }
            placeholder="Content"
          />
          <input
            type="date"
            value={editItem.date}
            onChange={(e) => setEditItem({ ...editItem, date: e.target.value })}
          />
          <input
            type="text"
            value={editItem.time}
            onChange={(e) => setEditItem({ ...editItem, time: e.target.value })}
            placeholder="Time (e.g., 14:00-16:00)"
          />
          <input
            type="text"
            value={editItem.location}
            onChange={(e) =>
              setEditItem({ ...editItem, location: e.target.value })
            }
            placeholder="Location"
          />
          <select
            value={editItem.status}
            onChange={(e) =>
              setEditItem({ ...editItem, status: e.target.value })
            }
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <form onSubmit={handleSave} className="edit-form">
          <h3>Edit Project</h3>
          <input
            type="text"
            value={editItem.title}
            onChange={(e) =>
              setEditItem({ ...editItem, title: e.target.value })
            }
            placeholder="Title"
          />
          <textarea
            value={editItem.description}
            onChange={(e) =>
              setEditItem({ ...editItem, description: e.target.value })
            }
            placeholder="Description"
          />
          <input
            type="text"
            value={editItem.technologies.join(", ")}
            onChange={(e) =>
              setEditItem({
                ...editItem,
                technologies: e.target.value.split(", "),
              })
            }
            placeholder="Technologies (comma-separated)"
          />
          <input
            type="text"
            value={editItem.githubLink}
            onChange={(e) =>
              setEditItem({ ...editItem, githubLink: e.target.value })
            }
            placeholder="GitHub Link"
          />
          <input
            type="text"
            value={editItem.liveDemo}
            onChange={(e) =>
              setEditItem({ ...editItem, liveDemo: e.target.value })
            }
            placeholder="Live Demo Link"
          />
          <input
            type="date"
            value={editItem.date}
            onChange={(e) => setEditItem({ ...editItem, date: e.target.value })}
          />
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "activities" ? "active" : ""}
          onClick={() => setActiveTab("activities")}
        >
          Activities
        </button>
        <button
          className={activeTab === "projects" ? "active" : ""}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
      </div>

      {isEditing ? (
        renderEditForm()
      ) : (
        <div className="content-list">
          {activeTab === "activities" ? (
            <>
              <h3>Activities</h3>
              {activities.map((activity) => (
                <div key={activity.id} className="content-item">
                  <h4>{activity.title}</h4>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(activity, "activity")}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id, "activity")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h3>Projects</h3>
              {projects.map((project) => (
                <div key={project.id} className="content-item">
                  <h4>{project.title}</h4>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(project, "project")}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project.id, "project")}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

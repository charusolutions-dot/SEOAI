import type { CSSProperties } from "react";
import { useState } from "react";
import { useProjects } from "../hooks/useProjects";

const MAX_PROJECTS = 3;

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16
};

const cellStyle: CSSProperties = {
  borderBottom: "1px solid #E5E7EB",
  padding: "12px 8px",
  textAlign: "left",
  verticalAlign: "top"
};

const headerStyle: CSSProperties = {
  ...cellStyle,
  fontSize: 12,
  color: "#6B7280",
  textTransform: "uppercase",
  letterSpacing: "0.04em"
};

const formStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto",
  gap: 12,
  alignItems: "end"
};

const helperStyle: CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: "#6B7280"
};

export const ProjectsPage = () => {
  const { projects, isLoading, error, limitMessage, addProject } = useProjects();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const limitReached = projects.length >= MAX_PROJECTS;
  const helperText = limitMessage ?? (limitReached ? "Free plan allows up to 3 projects." : null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (limitReached) {
      return;
    }
    await addProject({ name, url });
    setName("");
    setUrl("");
  };

  return (
    <section>
      <h1>Projects</h1>
      <form onSubmit={onSubmit} style={formStyle}>
        <label>
          <div>Name</div>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          <div>Website URL</div>
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={limitReached}>Add Project</button>
      </form>
      {helperText ? <div style={helperStyle}>{helperText}</div> : null}

      {isLoading ? <div>Loading projects...</div> : null}
      {error ? <div role="alert">{error}</div> : null}

      {!isLoading && projects.length === 0 ? <div>No projects yet.</div> : null}

      {projects.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th scope="col" style={headerStyle}>Name</th>
              <th scope="col" style={headerStyle}>URL</th>
              <th scope="col" style={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={cellStyle}>{project.name}</td>
                <td style={cellStyle}>{project.url}</td>
                <td style={cellStyle}>{project.isActive ? "Active" : "Paused"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
};

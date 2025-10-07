from pathlib import Path
path = Path(r"helpdesk-frontend/src/components/TicketList.jsx")
text = path.read_text()
old = "  }, [sortOptionsAvailable, sortOption]);\n\n  useEffect(() => {\n    if (!token) {\n"
new = "  }, [sortOptionsAvailable, sortOption]);\n\n  const fetchTechnicians = useCallback(async () => {\n    if (role !== 'Administrador' || !token) {\n      setTechnicians([]);\n      return;\n    }\n\n    setIsLoadingTechnicians(true);\n\n    try {\n      const response = await fetch(`${API_URL}/users`, {\n        headers: { Authorization: `Bearer ${token}` }\n      });\n\n      if (response.ok) {\n        const data = await response.json();\n        const list = Array.isArray(data)\n          ? data\n              .filter((user) => ((user.rol or user.get('rol') if isinstance(user, dict) else None) if isinstance(user, dict) else None))\n      }\n  }, [sortOptionsAvailable, sortOption]);\n"

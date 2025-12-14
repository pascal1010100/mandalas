-- SEED EVENTS SCRIPT
-- Populates the calendar with community events for the next 7 days

-- Delete old auto-generated events to avoid duplicates (optional, based on title prefix if needed)
-- delete from events where title like '%(Community)%';

insert into events (title, description, date, category, location) values
  (
    'Yoga al Amanecer', 
    'Clase de Hatha Yoga para empezar el día con energía. Todos los niveles.', 
    (now() + interval '1 day')::date + time '07:30:00', 
    'wellness', 
    'Pueblo'
  ),
  (
    'BBQ Familiar & Cervezas', 
    'Parrillada en el patio principal. Trae tu bebida, nosotros ponemos la comida.', 
    (now() + interval '2 days')::date + time '19:00:00', 
    'food', 
    'Pueblo'
  ),
  (
    'Noche de Música Acústica', 
    'Jam session abierta. Trae tu instrumento o simplemente ven a escuchar.', 
    (now() + interval '3 days')::date + time '20:30:00', 
    'music', 
    'Hideout'
  ),
  (
    'Caminata a la Cascada', 
    'Tour guiado a la cascada local. Salida desde recepción. Nivel medio.', 
    (now() + interval '4 days')::date + time '10:00:00', 
    'social', 
    'Hideout'
  ),
  (
    'Clase de Cocina Local', 
    'Aprende a preparar platos típicos de la región con Doña María.', 
    (now() + interval '5 days')::date + time '17:00:00', 
    'food', 
    'Pueblo'
  ),
  (
    'Meditación Sonora', 
    'Sesión de relajación con cuencos tibetanos y sonidos de la naturaleza.', 
    (now() + interval '6 days')::date + time '18:00:00', 
    'wellness', 
    'Hideout'
  );

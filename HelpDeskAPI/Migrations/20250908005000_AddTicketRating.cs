using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HelpDeskAPI.Migrations
{
    public partial class AddTicketRating : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Calificacion",
                table: "Tickets",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCalificacion",
                table: "Tickets",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Calificacion",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "FechaCalificacion",
                table: "Tickets");
        }
    }
}

